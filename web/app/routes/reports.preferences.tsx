import { useLoaderData, useNavigate } from "@remix-run/react";
import "~/styles/preferences.css";
import { preferencesLoader } from "../loaders/preferencesLoader";
import { Preferencia } from "../interfaces/preference";
import PreferencesTable from "../components/PreferencesTable";
import { useAuth } from "~/hooks/useAuth";


export const loader = preferencesLoader;

export default function Preferences() {
  const preferenciasData = useLoaderData<Preferencia[]>();

  const navigate = useNavigate();
  const { authorized } = useAuth(["ADMIN"]);

  if (!authorized) {
    navigate("/login");
  }

  return (
    <div className="container">
      <PreferencesTable preferenciasData={preferenciasData} />
    </div>
  );
}
