import type { ImageAsset } from '../data/content'

/**
 * Small-screen frame that follows the source's own orientation. Forcing the
 * portrait range photos into a landscape box on a phone cut the shooters off at
 * the chest, which is most of what these pictures are for.
 */
export const nativeFrame = (image: ImageAsset) =>
  image.width >= image.height ? 'aspect-[3/2]' : 'aspect-[4/5]'

type Props = {
  image: ImageAsset
  eager?: boolean
  className?: string
  sizes?: string
  /**
   * Take the height from the surrounding layout instead of the image. Without
   * this the intrinsic ratio wins: a portrait source in the hero grid pushed
   * the row past the viewport and dropped the headline below the fold.
   */
  fill?: boolean
  /**
   * Fit the whole frame instead of filling it. Documents only — a certificate
   * cropped to the container loses its letterhead and signature.
   */
  contain?: boolean
}

export function Media({
  image,
  eager = false,
  className = '',
  sizes = '(min-width: 768px) 50vw, 100vw',
  fill = false,
  contain = false,
}: Props) {
  return (
    <figure className={`group relative m-0 overflow-hidden bg-surface-hi ${className}`}>
      <img
        src={image.src}
        srcSet={image.srcSet}
        alt={image.alt}
        width={image.width}
        height={image.height}
        loading={eager ? 'eager' : 'lazy'}
        fetchPriority={eager ? 'high' : undefined}
        decoding="async"
        sizes={sizes}
        className={`${fill ? 'absolute inset-0 ' : ''}h-full w-full ${contain ? 'object-contain' : 'object-cover'} saturate-[0.82] transition-[filter,transform] duration-500 ease-spring group-hover:scale-[1.015] group-hover:saturate-100`}
      />
    </figure>
  )
}
