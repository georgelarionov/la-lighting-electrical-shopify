import type {ProductVariantFragment} from 'storefrontapi.generated';
import {Image} from '@shopify/hydrogen';

export function ProductImage({
  image,
}: {
  image: ProductVariantFragment['image'];
}) {
  if (!image) {
    return (
      <div className="aspect-square w-full rounded-[2px] border border-hairline bg-parchment" />
    );
  }
  return (
    <div className="overflow-hidden rounded-[2px] border border-hairline bg-parchment">
      <Image
        alt={image.altText || 'Product Image'}
        aspectRatio="1/1"
        data={image}
        key={image.id}
        sizes="(min-width: 1024px) 640px, 100vw"
        className="h-full w-full object-cover"
      />
    </div>
  );
}
