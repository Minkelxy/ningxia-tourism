/**
 * 把页面里的静态 SVG 导出成 PNG。
 *
 * 只用浏览器原生能力（XMLSerializer / canvas / Web Share），不引入任何依赖。
 * 调用方必须保证传入的 SVG 是「自包含且静态」的：样式内联、无跨域位图、无入场动画，
 * 否则序列化后会丢样式、污染 canvas 或截到动画中途的缺线状态。
 */

/** 2 倍导出，手机上看海报文字才不糊。 */
const EXPORT_SCALE = 2;
const FALLBACK_BACKGROUND = '#f7f3ea';

export type SvgExportResult = 'shared' | 'downloaded';

const serializeSvg = (svg: SVGSVGElement) => {
  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clone.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
  return `<?xml version="1.0" encoding="UTF-8"?>${new XMLSerializer().serializeToString(clone)}`;
};

const rasterize = (svg: SVGSVGElement, width: number, height: number) => new Promise<Blob>((resolve, reject) => {
  const url = URL.createObjectURL(new Blob([serializeSvg(svg)], { type: 'image/svg+xml;charset=utf-8' }));
  const image = new Image();
  const cleanup = () => URL.revokeObjectURL(url);
  image.onload = () => {
    cleanup();
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(width * EXPORT_SCALE);
    canvas.height = Math.round(height * EXPORT_SCALE);
    const context = canvas.getContext('2d');
    if (!context) {
      reject(new Error('无法创建画布上下文'));
      return;
    }
    // 先铺一层纸色：SVG 里若有透明区域，PNG 在深色背景的聊天软件里会发灰。
    context.fillStyle = FALLBACK_BACKGROUND;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('图片编码失败'));
    }, 'image/png');
  };
  image.onerror = () => {
    cleanup();
    reject(new Error('SVG 渲染失败'));
  };
  image.src = url;
});

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  // 立即 revoke 会让部分浏览器下载中断，交给浏览器读完再释放。
  window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
};

const canShareFile = (file: File) => typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] });

/**
 * 优先走系统分享面板（移动端可以直接发到微信/相册），否则退化为下载。
 * 用户在分享面板里取消会抛 AbortError，调用方需要与真正的失败区分开。
 */
export async function exportSvgToPng(svg: SVGSVGElement, filename: string): Promise<SvgExportResult> {
  const box = svg.viewBox.baseVal;
  const width = box.width || svg.clientWidth;
  const height = box.height || svg.clientHeight;
  if (!width || !height) throw new Error('SVG 尺寸不可读');

  const blob = await rasterize(svg, width, height);
  const file = new File([blob], filename, { type: 'image/png' });
  if (canShareFile(file)) {
    await navigator.share({ files: [file], title: filename });
    return 'shared';
  }
  downloadBlob(blob, filename);
  return 'downloaded';
}
