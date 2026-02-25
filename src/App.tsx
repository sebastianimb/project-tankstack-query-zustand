import { useState, useMemo } from "react";
import "./App.css";
import { UsersList } from "./components/UsersList";
import useUsers from "./hooks/useUsers";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type User, SortBy } from "../types.d";
import ToggleTheme from "./components/ToggleTheme";

const filterExcludedUsers = (users: User[], excluded: string[]) =>
  users.filter((user) => !excluded.includes(user.email));

const filterByCountry = (users: User[], search: string) => {
  if (!search.trim()) return users;
  return users.filter((user) =>
    user.location.country.toLowerCase().includes(search.toLowerCase()),
  );
};

const sortByCountryName = (users: User[], shouldSort: boolean) => {
  if (!shouldSort) return users;
  return [...users].sort((a, b) =>
    a.location.country.localeCompare(b.location.country, "es"),
  );
};

const sortByProperty = (users: User[], sort: SortBy) => {
  if (sort === SortBy.NONE) return users;

  const compareProperties: Record<string, (user: User) => string> = {
    [SortBy.COUNTRY]: (user) => user.location.country,
    [SortBy.NAME]: (user) => user.name.first,
    [SortBy.LAST]: (user) => user.name.last,
  };

  return [...users].sort((a, b) => {
    const property = compareProperties[sort];
    return property(a).localeCompare(property(b));
  });
};

function UsersContent() {
  const { users, isLoading, isError, error, refetch, fetchNextPage } =
    useUsers();
  const [sortByCountry, setSortByCountry] = useState(false);
  const [excludedUsers, setExcludedUsers] = useState<string[]>([]);
  const [filterInput, setFilterInput] = useState<string>("");
  const [changeColor, setChangeColor] = useState<boolean>(false);
  const [sort, setSort] = useState<SortBy>(SortBy.NONE);

  function handleDelete(email: string) {
    setExcludedUsers((prev) => {
      return [...prev, email];
    });
  }

  const usersFiltered = useMemo(() => {
    let filtered = users || [];
    filtered = filterExcludedUsers(filtered, excludedUsers);
    filtered = filterByCountry(filtered, filterInput);
    filtered = sortByCountryName(filtered, sortByCountry);
    filtered = sortByProperty(filtered, sort);
    return filtered;
  }, [users, excludedUsers, sortByCountry, filterInput, sort]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ) {
    e.preventDefault();
    setFilterInput(e.target.value);
  }

  async function handleReset() {
    setSort(SortBy.NONE);
    setSortByCountry(false);
    setExcludedUsers([]);
    setFilterInput("");
    setChangeColor(false);
    await refetch();
  }

  function handleSort(sortBy: SortBy) {
    setSort(sortBy);
  }

  return (
    <div className="bg-neutral-300 text-neutral-800 dark:bg-neutral-800 dark:text-white w-full">
      <div className="w-full p-8 md:p-0 md:pt-12 max-w-4xl mx-auto my-0 flex items-center justify-between">
        <div className="flex-1">
          <h1 className="text-3xl">Lista de usuarios</h1>
        </div>
        <ToggleTheme />
      </div>
      <header className="p-8 md:p-0 md:pt-12 md:pb-8 max-w-4xl mx-auto my-0 flex flex-wrap justify-between gap-8">
        <button
          onClick={() => {
            setChangeColor((prev) => !prev);
          }}
          className="flex-1 border border-green-700 hover:bg-green-700 hover:text-white cursor-pointer text-neutral-800 dark:text-white px-4 py-2 rounded transition-colors duration-300"
        >
          Colorear Filas
        </button>
        <button
          onClick={() => {
            setSortByCountry((prev) => !prev);
          }}
          className="flex-1 border border-blue-700 hover:bg-blue-700 hover:text-white cursor-pointer text-neutral-800 dark:text-white px-4 py-2 rounded transition-colors duration-300"
        >
          Ordenar por pais
        </button>
        <button
          onClick={handleReset}
          className="flex-1 border border-orange-700 hover:bg-orange-700 hover:text-white cursor-pointer text-neutral-800 dark:text-white px-4 py-2 rounded transition-colors duration-300"
        >
          Limpiar Filtros
        </button>
        <input
          type="text"
          onChange={(e) => {
            handleChange(e);
          }}
          value={filterInput}
          className="flex-1 border outline-0 border-gray-700 dark:border-gray-300 rounded px-4 py-2 transition-colors duration-300"
          placeholder="Filtra por país..."
        />
      </header>
      <main className="p-8 pt-4 flex w-full flex-col justify-center">
        {usersFiltered && usersFiltered.length > 0 && (
          <UsersList
            users={usersFiltered}
            changeColor={changeColor}
            handleDelete={handleDelete}
            changeSort={handleSort}
          />
        )}
        {!isLoading && (
          <div className="w-full flex justify-center py-8 mx-auto my-0">
            <button
              onClick={() => {
                fetchNextPage();
              }}
              className="px-12 py-4 rounded-md cursor-pointer bg-neutral-700 text-white"
            >
              Cargar más resultados
            </button>
            {isError && (
              <p>{error instanceof Error ? error.message : String(error)}</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UsersContent />
    </QueryClientProvider>
  );
}

export default App;
