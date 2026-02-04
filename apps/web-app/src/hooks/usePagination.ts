import { useState } from 'react';

export const usePagination = ({ take = 20, skip: _skip = 0 }: { take?: number; skip?: number }) => {
  const [skip, setSkip] = useState(_skip);

  const handleLoadMore = () => {
    setSkip(skip + take);
  };

  const handleLoadPrevious = () => {
    setSkip(Math.max(0, skip - take));
  };

  return {
    handleLoadMore,
    handleLoadPrevious,
    skip,
    take,
  };
};
