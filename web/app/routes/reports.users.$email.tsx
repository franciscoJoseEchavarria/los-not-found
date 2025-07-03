import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, Navigate } from "@remix-run/react";

/*logica para proteger vistas*/
import { useAuth } from "~/hooks/useAuth";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const email = url.searchParams.get("email");

  if (!email) throw new Response("Email is required", { status: 400 });

  try {
    // const response = await fetch(`http://localhost:5220/api/preferencias/usuario/${email}`);
    console.log({email});
    const response = await fetch(`http://localhost:5220/api/Destinos/by-email/${email}`);
    console.log({response});
    if (!response.ok) throw new Error("Error al cargar preferencias");

    const data = await response.json();
    return data[0]?.destinos || [];
  } catch (error) {
    console.error("Error en loader de preferencias:", error);
    return [];
  }
}

export default function UserPreferences() {
  const preferencias = useLoaderData<{ nombre: string; nombre_continente: string }[]>();

/*logica para proteger vistas*/
const { authorized } = useAuth(["ADMIN"]);

if (!authorized) {
  return <Navigate to="/login" replace />;
}

  return (
    <div className="overflow-auto max-h-16">
      <ul>
        {preferencias.map((destino, index) => (
          <li key={index} className="cursor-pointer">
            {destino.nombre} ({destino.nombre_continente})
          </li>
        ))}
      </ul>
    </div>
  );
}
