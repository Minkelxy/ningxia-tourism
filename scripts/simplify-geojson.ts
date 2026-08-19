import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

type Point = [number, number];
type Ring = Point[];

const [input = 'public/data/ningxia-province.json', output = 'public/data/ningxia-province-mobile.json', toleranceArg = '0.003'] = process.argv.slice(2);
const tolerance = Number(toleranceArg);
if (!Number.isFinite(tolerance) || tolerance <= 0) {
  console.error('容差必须是大于 0 的数字，例如 0.003。');
  process.exit(1);
}

const squaredDistance = (a: Point, b: Point) => ((a[0] - b[0]) ** 2) + ((a[1] - b[1]) ** 2);

const squaredSegmentDistance = (point: Point, start: Point, end: Point) => {
  let x = start[0];
  let y = start[1];
  const dx = end[0] - x;
  const dy = end[1] - y;
  if (dx !== 0 || dy !== 0) {
    const position = ((point[0] - x) * dx + (point[1] - y) * dy) / (dx * dx + dy * dy);
    if (position > 1) { x = end[0]; y = end[1]; }
    else if (position > 0) { x += dx * position; y += dy * position; }
  }
  return squaredDistance(point, [x, y]);
};

const simplifyOpenLine = (points: Ring, squaredTolerance: number): Ring => {
  if (points.length <= 2) return points;
  let farthestIndex = 0;
  let farthestDistance = squaredTolerance;
  const end = points[points.length - 1];
  const start = points[0];
  for (let index = 1; index < points.length - 1; index += 1) {
    const distance = squaredSegmentDistance(points[index], start, end);
    if (distance > farthestDistance) {
      farthestIndex = index;
      farthestDistance = distance;
    }
  }
  if (farthestIndex === 0) return [start, end];
  const left = simplifyOpenLine(points.slice(0, farthestIndex + 1), squaredTolerance);
  const right = simplifyOpenLine(points.slice(farthestIndex), squaredTolerance);
  return [...left.slice(0, -1), ...right];
};

const simplifyRing = (ring: Ring) => {
  if (ring.length <= 4) return ring;
  const closed = squaredDistance(ring[0], ring[ring.length - 1]) === 0;
  const open = closed ? ring.slice(0, -1) : ring;
  const simplified = simplifyOpenLine(open, tolerance ** 2);
  const result = simplified.length >= 3 ? simplified : open.slice(0, 3);
  return closed ? [...result, result[0]] : result;
};

const simplifyCoordinates = (coordinates: unknown): unknown => {
  if (!Array.isArray(coordinates) || coordinates.length === 0) return coordinates;
  if (typeof coordinates[0] === 'number') return coordinates;
  if (Array.isArray(coordinates[0]) && typeof coordinates[0][0] === 'number') return simplifyRing(coordinates as Ring);
  return coordinates.map(simplifyCoordinates);
};

const source = JSON.parse(readFileSync(resolve(input), 'utf8')) as { features: Array<{ geometry: { coordinates: unknown } }> };
const simplified = {
  ...source,
  features: source.features.map((feature) => ({
    ...feature,
    geometry: { ...feature.geometry, coordinates: simplifyCoordinates(feature.geometry.coordinates) },
  })),
};
writeFileSync(resolve(output), `${JSON.stringify(simplified)}\n`);

const countPoints = (value: unknown): number => {
  if (!Array.isArray(value)) return 0;
  if (typeof value[0] === 'number') return 1;
  return value.reduce<number>((total, item) => total + countPoints(item), 0);
};
const before = source.features.reduce((total, feature) => total + countPoints(feature.geometry.coordinates), 0);
const after = simplified.features.reduce((total, feature) => total + countPoints(feature.geometry.coordinates), 0);
console.log(`已生成 ${output}：${before} → ${after} 个坐标点，容差 ${tolerance}°。`);
