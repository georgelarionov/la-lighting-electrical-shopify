import * as React from 'react';
import {Pagination} from '@shopify/hydrogen';

const loadMoreClass =
  'inline-flex h-11 items-center justify-center rounded-[2px] border border-hairline bg-canvas px-6 type-caption-strong text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white';

/**
 * <PaginatedResourceSection> encapsulates the previous and next pagination behaviors throughout your application.
 */
export function PaginatedResourceSection<NodesType>({
  connection,
  children,
  ariaLabel,
  resourcesClassName,
}: {
  connection: React.ComponentProps<typeof Pagination<NodesType>>['connection'];
  children: React.FunctionComponent<{node: NodesType; index: number}>;
  ariaLabel?: string;
  resourcesClassName?: string;
}) {
  return (
    <Pagination connection={connection}>
      {({nodes, isLoading, PreviousLink, NextLink}) => {
        const resourcesMarkup = nodes.map((node, index) =>
          children({node, index}),
        );

        return (
          <div>
            <div className="mb-8 flex justify-center empty:mb-0">
              <PreviousLink className={loadMoreClass}>
                {isLoading ? 'Loading…' : <span>↑ Load previous</span>}
              </PreviousLink>
            </div>
            {resourcesClassName ? (
              <div
                aria-label={ariaLabel}
                className={resourcesClassName}
                role={ariaLabel ? 'region' : undefined}
              >
                {resourcesMarkup}
              </div>
            ) : (
              resourcesMarkup
            )}
            <div className="mt-12 flex justify-center empty:mt-0">
              <NextLink className={loadMoreClass}>
                {isLoading ? 'Loading…' : <span>Load more ↓</span>}
              </NextLink>
            </div>
          </div>
        );
      }}
    </Pagination>
  );
}
