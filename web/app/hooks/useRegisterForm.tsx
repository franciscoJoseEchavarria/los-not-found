import { useState } from "react";
import { registerUser } from "~/services/recordService"; // Servicio para enviar datos
import { UserRecord } from "~/interfaces/UserRecord"; // Interfaz de datos
import { useNavigate } from "react-router-dom";

export const useRegisterForm = () => {
  const [mensajeExito, setMensajeExito] = useState(false); // Estado del mensaje de éxito
  const [mensajeError, setMensajeError] = useState<string | null>(null); // Estado para el mensaje de error
  const [aceptado, setAceptado] = useState(false); // Estado del checkbox
  const navigate = useNavigate();

  // Actualiza el estado del checkbox
  const manejarCambio = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAceptado(event.target.checked);
  };

  // Maneja el envío del formulario
  const manejarEnvio = async (event: React.FormEvent<HTMLFormElement>) => {
    console.log("La función manejarEnvio se ha llamado");
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const nombre = formData.get("nombre") as string;
    const password = formData.get("password") as string;

    if (!email || !nombre || !password) {
      setMensajeError("Todos los campos son obligatorios.");
      setTimeout(() => setMensajeError(null), 3000);
      return;
    }

    const userType = formData.get("rol") as string;

    if (!userType) {
      setMensajeError("El campo rol es obligatorio.");
      setTimeout(() => setMensajeError(null), 3000);
      return;
    }

    const user: UserRecord = { email, nombre, password, userType };

    try {
      const result = await registerUser(user); // Llama al servicio para enviar datos
      console.log("Usuario registrado correctamente:", result);

      setMensajeExito(true); // Mostrar mensaje de éxito

      setTimeout(() => {
        setMensajeExito(false); // Oculta el mensaje después de 3 segundos
        navigate("/login"); // Redirige al login
      }, 3000);
    } catch (error) {
      // Verifica el tipo de error usando `instanceof`
      if (error instanceof Error) {
        console.error("Error durante el registro:", error.message);
        setMensajeError("Ocurrió un problema al registrar: " + error.message);
      } else {
        console.error("Error desconocido:", error);
        setMensajeError("Ocurrió un problema desconocido al registrar.");
      }
      setTimeout(() => setMensajeError(null), 3000);
    }
  };

  return { mensajeExito, mensajeError, aceptado, manejarCambio, manejarEnvio };
};
