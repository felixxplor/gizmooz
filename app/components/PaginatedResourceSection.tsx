import * as React from 'react';
import {Pagination} from '@shopify/hydrogen';

/**
 * <PaginatedResourceSection > is a component that encapsulate how the previous and next behaviors throughout your application.
 */
export function PaginatedResourceSection<NodesType>({
  connection,
  children,
  resourcesClassName,
}: {
  connection: React.ComponentProps<typeof Pagination<NodesType>>['connection'];
  children: React.FunctionComponent<{node: NodesType; index: number}>;
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
            <div className="flex justify-center mb-8">
              <PreviousLink className="btn-secondary px-6 py-3 text-sm font-medium">
                {isLoading ? 'Loading...' : <span>&#8593; Load previous</span>}
              </PreviousLink>
            </div>
            {resourcesClassName ? (
              <div className={resourcesClassName}>{resourcesMarkup}</div>
            ) : (
              resourcesMarkup
            )}
            <div className="flex justify-center mt-8">
              <NextLink className="btn-primary px-8 py-3 text-sm font-medium">
                {isLoading ? 'Loading...' : <span>Load more &#8595;</span>}
              </NextLink>
            </div>
          </div>
        );
      }}
    </Pagination>
  );
}
