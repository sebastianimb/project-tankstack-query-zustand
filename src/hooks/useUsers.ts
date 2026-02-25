import { useInfiniteQuery } from "@tanstack/react-query";
import { type User } from "../types.d";
import { getUsers } from "../services/users";

export default function useUsers() {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery<{
    users: User[];
    nextCursor: number;
  }>({
    queryKey: ["users"],
    queryFn: ({ pageParam }) => getUsers({ pageParam: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
  return {
    users: data?.pages.flatMap((page) => page.users),
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    refetch,
  };
}
