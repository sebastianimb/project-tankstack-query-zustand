import { type User } from "../types.d";

export async function getUsers({
  pageParam = 1,
}: {
  pageParam?: number;
}): Promise<{
  users: User[];
  nextCursor: number;
}> {
  const res = await fetch(
    `https://randomuser.me/api?results=10&seed=sebastianimb&page=${pageParam}`,
  );

  if (!res.ok) throw new Error("Error en la petición");

  const { results, info } = await res.json();
  const nextCursor = Number(info.page) + 1;
  return {
    users: results,
    nextCursor,
  };
}
