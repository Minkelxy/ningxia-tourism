import type { CityId, Coordinates, RoutePlan, VerificationLevel } from '../types';
import { getAttractionById } from '../data/attractions';
import type { GeoBounds } from '../components/map/projection';
import { getRouteEvidenceSummary, type RouteEvidenceSummary } from './route';

/**
 * 地理缩略图的最小经纬跨度（约 0.15°，宁夏纬度下约 15km）。
 * 只在一座城市内活动的路线（如石嘴山两日）有效点会很集中，若不扩张跨度，
 * createProjection 会把地图放大到只剩几个孤立点位，失去地理语境。
 */
export const MIN_BOUNDS_SPAN = 0.15;

export interface RoadbookNode {
  /**
   * 跨天连续的全局编号，从 1 开始。路书要读成一条完整路线，因此与详情页
   * 时间线的「每日从 1 重新开始」编号（.stop-number）有意不同，不是 bug。
   */
  order: number;
  day: number;
  /** 当天内的序号，从 0 开始，供错峰动效使用。 */
  indexInDay: number;
  time: string;
  title: string;
  attractionId?: string;
  /** 仅当停靠点解析到「已发布」景点时才有值。 */
  coordinates?: Coordinates;
  cityId?: CityId;
  verificationLevel?: VerificationLevel;
  /** 仅有 mapQuery、没有坐标的市区/车站类路点，不参与地理连线。 */
  isQueryOnly: boolean;
}

export interface RoadbookDay {
  day: number;
  title: string;
  summary: string;
  nodes: RoadbookNode[];
  /** 当天已解析景点所属城市，去重且保持出现顺序。 */
  cityIds: CityId[];
  meals: string[];
  accommodation: string;
}

export interface RoadbookModel {
  route: RoutePlan;
  days: RoadbookDay[];
  /** 全部停靠点，含无坐标路点。 */
  nodes: RoadbookNode[];
  /** 有真实坐标、可用于地理连线的点。 */
  geocodedNodes: RoadbookNode[];
  /** 无坐标、只能出现在流线图上的点。 */
  queryOnlyNodes: RoadbookNode[];
  cityIds: CityId[];
  /** 仅由 geocodedNodes 计算并做最小跨度扩张；无坐标点时返回 null，由调用方回退到省界范围。 */
  bounds: GeoBounds | null;
  evidence: RouteEvidenceSummary;
}

/** 由一组坐标求包围盒，并把不足 MIN_BOUNDS_SPAN 的边居中扩张到该跨度。 */
export const boundsFromCoordinates = (points: Coordinates[], minSpan = MIN_BOUNDS_SPAN): GeoBounds | null => {
  if (!points.length) return null;
  let minLng = Infinity;
  let maxLng = -Infinity;
  let minLat = Infinity;
  let maxLat = -Infinity;
  for (const { lng, lat } of points) {
    minLng = Math.min(minLng, lng);
    maxLng = Math.max(maxLng, lng);
    minLat = Math.min(minLat, lat);
    maxLat = Math.max(maxLat, lat);
  }
  const grow = (min: number, max: number) => {
    if (max - min >= minSpan) return [min, max] as const;
    const pad = (minSpan - (max - min)) / 2;
    return [min - pad, max + pad] as const;
  };
  const [lngMin, lngMax] = grow(minLng, maxLng);
  const [latMin, latMax] = grow(minLat, maxLat);
  return { minLng: lngMin, maxLng: lngMax, minLat: latMin, maxLat: latMax };
};

export const buildRoadbookModel = (route: RoutePlan): RoadbookModel => {
  const nodes: RoadbookNode[] = [];
  const days: RoadbookDay[] = [];
  let order = 0;

  for (const day of route.days) {
    const dayNodes: RoadbookNode[] = [];
    const cityIds: CityId[] = [];

    day.stops.forEach((stop, indexInDay) => {
      const attraction = getAttractionById(stop.attractionId);
      // getAttractionById 会返回草稿景点，必须与 getRouteEvidenceSummary 一样
      // 只认已发布内容，避免把未公开点位画进线路图。
      const published = attraction && attraction.status === 'published' ? attraction : undefined;
      if (published && !cityIds.includes(published.cityId)) cityIds.push(published.cityId);

      order += 1;
      const node: RoadbookNode = {
        order,
        day: day.day,
        indexInDay,
        time: stop.time,
        title: stop.title,
        attractionId: published?.id,
        coordinates: published?.coordinates,
        cityId: published?.cityId,
        verificationLevel: published?.verificationLevel,
        isQueryOnly: !published?.coordinates,
      };
      dayNodes.push(node);
      nodes.push(node);
    });

    days.push({
      day: day.day,
      title: day.title,
      summary: day.summary,
      nodes: dayNodes,
      cityIds,
      meals: day.meals,
      accommodation: day.accommodation,
    });
  }

  const geocodedNodes = nodes.filter((node) => node.coordinates);
  const evidence = getRouteEvidenceSummary(route);

  return {
    route,
    days,
    nodes,
    geocodedNodes,
    queryOnlyNodes: nodes.filter((node) => node.isQueryOnly),
    cityIds: evidence.cityIds,
    bounds: boundsFromCoordinates(geocodedNodes.map((node) => node.coordinates as Coordinates)),
    evidence,
  };
};

/** 按天分组的可连线点位（每天一段，不跨天连接，以区分「当天移动」与「跨城转场」）。 */
export const routeSegments = (model: RoadbookModel): Array<{ day: number; nodes: RoadbookNode[] }> => model.days
  .map((day) => ({ day: day.day, nodes: day.nodes.filter((node) => node.coordinates) }))
  .filter((segment) => segment.nodes.length > 0);

/** 中文按 1 个字宽、西文数字按 0.55 字宽估算，用于海报的手工折行。 */
const charWidth = (char: string) => (/[\u2E80-\u9FFF\u3000-\u303F\uFF00-\uFFEF]/.test(char) ? 1 : 0.55);

/** 按同一套字宽估算一段文本的像素宽度，供海报排版分配栏宽。 */
export const estimateTextWidth = (text: string, fontSize: number): number => {
  let width = 0;
  for (const char of text) width += charWidth(char);
  return width * fontSize;
};

/** SVG 的 <text> 不会自动换行，导出前必须自己折成多行。 */
export const wrapText = (text: string, maxCharsPerLine: number): string[] => {
  const lines: string[] = [];
  let current = '';
  let width = 0;
  for (const char of text) {
    const next = charWidth(char);
    if (width + next > maxCharsPerLine && current) {
      lines.push(current);
      current = '';
      width = 0;
    }
    current += char;
    width += next;
  }
  if (current) lines.push(current);
  return lines.length ? lines : [''];
};
