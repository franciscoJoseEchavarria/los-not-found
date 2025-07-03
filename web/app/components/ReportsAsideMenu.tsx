import { NavLink } from "@remix-run/react";

const ReportsAsideMenu = () => {
  return (
    <aside className="w-[15%] min-w-[180px] bg-[#282c34] text-white p-5 fixed h-full">
      <h2 className="text-xl font-bold">Reports</h2>
      <nav>
        <ul className="mt-8 space-y-2.5">
          <li>
            <NavLink
              to="destinations"
              className={({ isActive }) => 
                isActive 
                  ? "block p-2.5 rounded bg-[#61dafb] text-black"
                  : "block p-2.5 rounded hover:bg-gray-700"
              }
            >
              Destinos
            </NavLink>
          </li>
          <li>
            <NavLink
              to="users"
              className={({ isActive }) => 
                isActive 
                  ? "block p-2.5 rounded bg-[#61dafb] text-black"
                  : "block p-2.5 rounded hover:bg-gray-700"
              }
            >
              Usuarios
            </NavLink>
          </li>
          <li>
            <NavLink
              to="preferences"
              className={({ isActive }) => 
                isActive 
                  ? "block p-2.5 rounded bg-[#61dafb] text-black"
                  : "block p-2.5 rounded hover:bg-gray-700"
              }
            >
              Preferencias
            </NavLink>
          </li>
          <li>
            <NavLink
              to="statistics"
              className={({ isActive }) => 
                isActive 
                  ? "block p-2.5 rounded bg-[#61dafb] text-black"
                  : "block p-2.5 rounded hover:bg-gray-700"
              }
            >
              Estadísticas
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default ReportsAsideMenu;
