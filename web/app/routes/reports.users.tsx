import { useLoaderData, useNavigate } from "@remix-run/react";
import { usersLoader } from "../loaders/usersLoader";
import UsersTable from "../components/UsersTable";
import { useUserPreferences } from "../hooks/useUserPreferences";
import { useAuth } from "~/hooks/useAuth";

export const loader = usersLoader;

interface User {
  nombre: string;
  email: string;
}

export default function Users() {
  const usuariosData = useLoaderData<User[]>();

  const {
    preferenciasUsuario,
    visibilidadPreferencias,
    loadPreferenciasUsuario,
    cargando,
  } = useUserPreferences();

  const navigate = useNavigate();
    const { authorized } = useAuth(["ADMIN"]);

    if (!authorized) {
      navigate("/login");
    }

  return (
    <UsersTable
      usuariosData={usuariosData}
      preferenciasUsuario={preferenciasUsuario}
      visibilidadPreferencias={visibilidadPreferencias}
      loadPreferenciasUsuario={loadPreferenciasUsuario}
      cargando={cargando}
    />
  );
}
