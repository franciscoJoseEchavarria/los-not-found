import { useState, useEffect, useMemo } from "react";

export const useAuth = (requiredRoles: string[]) => {
  const [auth, setAuth] = useState<{ authorized: boolean; reason?: string }>({
    authorized: false,
  });

  const memoizedRoles = useMemo(() => requiredRoles, [JSON.stringify(requiredRoles)]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const storedData = sessionStorage.getItem("userAuthData");
    if (!storedData) {
      setAuth({ authorized: false, reason: "No hay datos de autenticación" });
      return;
    }

    try {
      const userAuth = JSON.parse(storedData);
      const token = userAuth.token;
      const role = userAuth.role;

      if (!token) {
        setAuth({ authorized: false, reason: "No autenticado" });
      } else if (!memoizedRoles.includes(role)) {
        setAuth({ authorized: false, reason: "Rol no autorizado" });
      } else {
        setAuth({ authorized: true });
      }
    } catch (error) {
      setAuth({ authorized: false, reason: "Error al parsear los datos de autenticación" });
    }
  }, [memoizedRoles]);

  return auth;
};
