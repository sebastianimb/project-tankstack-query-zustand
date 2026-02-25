import { type User, SortBy } from "../types.d";
import stash from "../assets/stash.svg";
import style from "../style/table.module.css";

type userListProps = {
  users?: User[];
  handleDelete: (email: string) => void;
  changeColor: boolean;
  changeSort: (sortBy: SortBy) => void;
};

export function UsersList({
  users,
  handleDelete,
  changeColor,
  changeSort,
}: userListProps) {
  return (
    <table
      className={`w-full max-w-4xl border-collapse border border-neutral-700 overflow-hidden ${style.table}`}
    >
      <thead className="bg-neutral-200 dark:bg-neutral-700">
        <tr>
          <th className="hidden md:table-cell border border-neutral-700 px-4 py-3 text-center">
            Foto
          </th>
          <th
            className="border cursor-pointer hover:bg-neutral-950 hover:text-white border-neutral-700 px-4 py-3 text-center"
            onClick={() => {
              changeSort(SortBy.NAME);
            }}
          >
            Nombre
          </th>
          <th
            className="hidden cursor-pointer hover:bg-neutral-950 hover:text-white md:table-cell border border-neutral-700 px-4 py-3 text-center"
            onClick={() => {
              changeSort(SortBy.LAST);
            }}
          >
            Apellido
          </th>
          <th
            className="border cursor-pointer hover:bg-neutral-950 hover:text-white border-neutral-700 px-4 py-3 text-center"
            onClick={() => {
              changeSort(SortBy.COUNTRY);
            }}
          >
            País
          </th>
          <th className="border border-neutral-700 px-4 py-3 text-center">
            Acciones
          </th>
        </tr>
      </thead>
      <tbody>
        {users &&
          users.map((user, index) => {
            return (
              <tr
                key={user.email}
                className={
                  changeColor && index % 2 === 0
                    ? "bg-neutral-900 text-white dark:bg-white dark:text-black"
                    : ""
                }
              >
                <td className="hidden md:table-cell border border-neutral-700 px-4 py-3 text-center">
                  <div className="flex justify-center">
                    <img
                      src={user.picture.medium}
                      alt="Foto de usuario"
                      className="w-12 h-12 rounded-full"
                    />
                  </div>
                </td>
                <td className="border border-neutral-700 px-4 py-3 text-center">
                  {user.name.first}
                </td>
                <td className="hidden md:table-cell border border-neutral-700 px-4 py-3 text-center">
                  {user.name.last}
                </td>
                <td className="border border-neutral-700 px-4 py-3 text-center">
                  {user.location.country}
                </td>
                <td className="border border-neutral-700 px-4 py-3 text-center">
                  <button
                    onClick={() => {
                      handleDelete(user.email);
                    }}
                    className="bg-red-600 hover:bg-red-700 cursor-pointer text-white px-3 py-1 rounded text-sm"
                  >
                    <img src={stash} width={24} height={24} />
                  </button>
                </td>
              </tr>
            );
          })}
      </tbody>
    </table>
  );
}
