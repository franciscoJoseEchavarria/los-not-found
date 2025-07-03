import { useState } from "react";
import { fetchUserPreferences } from "../services/userService";
import { getTokenFromCookiesClient } from "~/utils/cookieUtils";

interface Destination {
  nombre: string;
  nombre_continente: string;
}

export function useUserPreferences() {
  const [preferenciasUsuario, setPreferenciasUsuario] = useState<{
    [email: string]: Destination[];
  }>({});
  const [visibilidadPreferencias, setVisibilidadPreferencias] = useState<{
    [email: string]: boolean;
  }>({});
  const [cargando, setCargando] = useState<{ [email: string]: boolean }>({});

  async function loadPreferenciasUsuario(email: string) {
    if (preferenciasUsuario[email]) {
      setVisibilidadPreferencias((prev) => ({
        ...prev,
        [email]: !prev[email],
      }));
      return;
    }

    setCargando((prev) => ({ ...prev, [email]: true }));

    try {
    const token = getTokenFromCookiesClient()

    if (!token) {
      console.error("Token is required but was not provided");
      return [];
    }

      const preferencias = await fetchUserPreferences(email, token);
      setPreferenciasUsuario((prev) => ({
        ...prev,
        [email]: preferencias || [],
      }));
      setVisibilidadPreferencias((prev) => ({ ...prev, [email]: true }));
    } catch (error) {
      console.error("Error al cargar preferencias:", error);
    } finally {
      setCargando((prev) => ({ ...prev, [email]: false }));
    }
  }

  return {
    preferenciasUsuario,
    visibilidadPreferencias,
    loadPreferenciasUsuario,
    cargando,
  };
}
