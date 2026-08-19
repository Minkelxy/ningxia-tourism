import { memo, type ImgHTMLAttributes } from 'react';
import { assetUrl } from '../lib/site';

interface ResponsiveImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string;
  pictureClassName?: string;
}

function ResponsiveImage({ src, pictureClassName, sizes = '100vw', loading = 'lazy', decoding = 'async', fetchPriority, ...props }: ResponsiveImageProps) {
  const base = src.replace(/\.webp$/i, '');
  const webp = `${assetUrl(`${base}-720.webp`)} 720w, ${assetUrl(`${base}-1440.webp`)} 1440w`;
  const avif = `${assetUrl(`${base}-720.avif`)} 720w, ${assetUrl(`${base}-1440.avif`)} 1440w`;
  return (
    <picture className={pictureClassName}>
      <source type="image/avif" srcSet={avif} sizes={sizes} />
      <source type="image/webp" srcSet={webp} sizes={sizes} />
      <img src={assetUrl(src)} sizes={sizes} loading={loading} decoding={decoding} {...props} {...(fetchPriority ? { fetchpriority: fetchPriority } : {})} />
    </picture>
  );
}

export default memo(ResponsiveImage);
