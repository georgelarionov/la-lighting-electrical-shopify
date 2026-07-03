import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import {ArrowRight} from 'lucide-react';
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
      className={cn(
        'lift group flex flex-col overflow-hidden rounded-lg border border-hairline bg-canvas',
        className,
      )}
      key={product.id}
      prefetch="intent"
      to={variantUrl}
    >
      <div className="img-zoom overflow-hidden bg-parchment">
        {image ? (
          <Image
            alt={image.altText || product.title}
            aspectRatio="1/1"
            data={image}
            loading={loading}
            sizes="(min-width: 45em) 400px, 50vw"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="aspect-square" />
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h4 className="type-caption-strong text-ink transition-colors group-hover:text-primary">
          {product.title}
        </h4>
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="type-caption font-medium text-ink">
            <Money data={product.priceRange.minVariantPrice} />
          </span>
          <ArrowRight className="size-4 text-ink-subtle transition-transform group-hover:translate-x-1 group-hover:text-primary" />
        </div>
      </div>
    </Link>
  );
}
