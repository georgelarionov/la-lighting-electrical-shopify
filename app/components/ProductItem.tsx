import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import type {
  ProductItemFragment,
  CollectionItemFragment,
} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';
import {cn} from '~/lib/utils';

export function ProductItem({
  product,
  loading,
  className,
}: {
  product: CollectionItemFragment | ProductItemFragment;
  loading?: 'eager' | 'lazy';
  className?: string;
}) {
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage;
  return (
    <Link
      className={cn('group flex flex-col', className)}
      key={product.id}
      prefetch="intent"
      to={variantUrl}
    >
      <div className="overflow-hidden rounded-[2px] border border-hairline bg-parchment">
        {image ? (
          <Image
            alt={image.altText || product.title}
            aspectRatio="1/1"
            data={image}
            loading={loading}
            sizes="(min-width: 45em) 400px, 50vw"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <div className="aspect-square" />
        )}
      </div>
      <h4 className="type-body-strong mt-4 text-ink transition-colors group-hover:text-primary">
        {product.title}
      </h4>
      <div className="type-caption mt-1 text-ink-subtle">
        <Money data={product.priceRange.minVariantPrice} />
      </div>
    </Link>
  );
}
