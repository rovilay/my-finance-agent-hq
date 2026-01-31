import { useMeQuery } from '@/lib/graphql';

export const useMe = () => {
  const { data, loading, error } = useMeQuery();

  return {
    me: data?.me || null,
    loading,
    error,
  };
};
