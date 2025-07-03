import { Outlet, useNavigate } from "@remix-run/react";
import ReportsAsideMenu from "~/components/ReportsAsideMenu";

/* Lógica para proteger vistas */
import { useAuth } from "~/hooks/useAuth";

export default function ReportsLayout() {
  const navigate = useNavigate();
  const { authorized } = useAuth(["ADMIN"]);

  if (!authorized) {
    // return <Navigate to="/login" replace />;
    navigate("/login");
  }
  return (
    <div className="flex h-screen">
      <ReportsAsideMenu />

      <main className="flex-1 p-5 pl-[calc(15%+20px)]">
        <Outlet />
      </main>
    </div>
  );
}
