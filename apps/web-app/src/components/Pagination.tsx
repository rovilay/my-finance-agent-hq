import { Button } from './ui';

interface PaginationProps {
  skip: number;
  take: number;
  total: number;
  hasMore: boolean;
  handleLoadPrevious: () => void;
  handleLoadMore: () => void;
}

export const Pagination = ({
  skip,
  take,
  total,
  hasMore,
  handleLoadPrevious,
  handleLoadMore,
}: PaginationProps) => {
  if (total === 0 || total <= take) {
    return null;
  }

  return (
    <div className="flex items-center justify-between pt-4">
      <Button variant="outline" onClick={handleLoadPrevious} disabled={skip === 0}>
        Previous
      </Button>
      <span className="text-sm text-neutral-500">
        Showing {skip + 1}-{Math.min(skip + take, total)} of {total}
      </span>
      <Button variant="outline" onClick={handleLoadMore} disabled={!hasMore}>
        Next
      </Button>
    </div>
  );
};
