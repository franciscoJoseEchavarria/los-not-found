import { useNavigate, Navigate } from "@remix-run/react";
import { useAuth } from "~/hooks/useAuth";
import { useEffect, useState } from "react";
import { destinoService } from "~/services/destinoService";

export const links = () => {
  return [
    {
      rel: "preconnect",
      href: "https://fonts.googleapis.com",
    },
    {
      href: "https://fonts.googleapis.com/css2?family=Inconsolata:wght@200..900&family=Montserrat:ital,wght@0,100..900;1,100..900&family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap",
      rel: "stylesheet",
    },
    {
      href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",
      rel: "stylesheet",
    },
  ];
};

export default function Resultados() {
  useEffect(() => {
    const respuestasGuardadas = sessionStorage.getItem("respuestas");
    if (respuestasGuardadas) {
      setRespuestas(JSON.parse(respuestasGuardadas));
    } else {
      console.error("No se encontraron respuestas en sessionStorage.");
    }
  }, []);

  const [respuestas, setRespuestas] = useState<string[]>([]);
  const navigate = useNavigate();
  const { authorized } = useAuth(["CLIENT", "ADMIN"]);

  if (!respuestas || respuestas.length === 0) {
    return (
      <main className="min-h-screen w-full bg-[#f8f9fa] flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-[#0033A0] text-2xl font-semibold">No se encontraron respuestas</h1>
          <button 
            onClick={() => navigate('/tarjetas')}
            className="mt-6 bg-[#0033A0] hover:bg-[#002169] text-white px-6 py-3 rounded-lg transition-colors"
          >
            Volver al inicio
          </button>
        </div>
      </main>
    );
  }

  /*logica para proteger vistas*/
  if (!authorized) {
    return <Navigate to="/login" replace />;
  }

  const enviarDestino = async () => {
    try {
      const userAuthData = sessionStorage.getItem("userAuthData");
      const parsedData = userAuthData ? JSON.parse(userAuthData) : null;
      const email = parsedData?.email || "";

      const body = {
        email: email,
        entorno: sessionStorage.getItem("respuesta_0") || "",
        clima: sessionStorage.getItem("respuesta_1") || "",
        actividad: sessionStorage.getItem("respuesta_2") || "",
        alojamiento: sessionStorage.getItem("respuesta_3") || "",
        tiempo_viaje: sessionStorage.getItem("respuesta_4") || "",
        rango_edad: sessionStorage.getItem("respuesta_5") || "",
      };

      const response = await fetch("http://localhost:5220/api/PreferenciaUsuarios/asignar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`Error en la API: ${response.status} ${response.statusText}`);
      }

      // Verifica si la respuesta tiene contenido antes de parsearla
      const text = await response.text();
      if (!text) {
        console.warn("La API devolvió una respuesta vacía");
        return;
      }

      let data;
      try {
        data = JSON.parse(text);
      } catch (jsonError) {
        console.error("La respuesta de la API no es un JSON válido:", text);
        throw new Error("La respuesta de la API no es un JSON válido");
      }

      if (data) {
        sessionStorage.setItem("destinos", JSON.stringify(data));
      }

      destinoService.destinoA = data[0];
      destinoService.destinoE = data[1];

      navigate("/destino");
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  const volverAtras = () => {
    if (respuestas.length > 0) {
      const nuevasRespuestas = [...respuestas];
      nuevasRespuestas.pop(); // Elimina la última respuesta
      sessionStorage.setItem("respuestas", JSON.stringify(nuevasRespuestas));
      setRespuestas(nuevasRespuestas); // Actualiza el estado local
    }
    navigate("/tarjetas"); // Redirige a la página de tarjetas
  };

  return (
    <div className="w-full bg-[#f8f9fa] h-[94vh] flex flex-col overflow-hidden">
      {/* Main content container - using flex-1 to take remaining space */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Hero Section with gradient background - reduced height */}
        <div className="w-full relative h-[22vh] bg-gradient-to-br from-[#0033A0] to-[#002169] overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[url('https://amadeus.com/static/custom/resources/20230829162608/dist/images/section-texture-bright.svg')] bg-center opacity-10"></div>
          
          {/* Decorative Elements */}
          <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#002169] to-transparent"></div>
          <div className="absolute -bottom-16 -right-16 w-80 h-80 rounded-full bg-[#005EB8] opacity-20"></div>
          <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-[#75B000] opacity-10"></div>
          
          {/* Back button integrated into hero section */}
          <div className="absolute top-3 left-4 z-20">
            <button 
              onClick={volverAtras}
              className="flex items-center gap-2 text-white hover:text-white/80 transition-colors bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg"
            >
              <i className="fa-solid fa-arrow-left text-sm"></i>
              <span className="text-sm font-medium">Volver al test</span>
            </button>
          </div>
          
          {/* Content */}
          <div className="container mx-auto h-full flex items-center justify-center px-6 relative z-10">
            <div className="text-center">
              <div className="flex gap-2 justify-center items-center mb-1">
                <div className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full inline-flex items-center">
                  <i className="fa-solid fa-check-circle text-[#75B000] mr-2"></i>
                  <span className="text-white/90 text-sm">Tus respuestas</span>
                </div>
              </div>
              <h1 className="text-white text-3xl lg:text-4xl font-light mb-2">Resumen de preferencias</h1>
              <p className="text-white/80 max-w-2xl mx-auto text-sm">
                Revisa tus preferencias antes de confirmar y descubrir los destinos que mejor se adaptan a tus gustos.
              </p>
            </div>
          </div>

          {/* Bottom Curve */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 60" className="w-full h-auto fill-[#f8f9fa]" preserveAspectRatio="none">
              <path d="M0,0V60H1440V0C1440,0,1320,60,720,60C120,60,0,0,0,0Z"></path>
            </svg>
          </div>
        </div>

        {/* Content Section - added flex classes to center content card vertically */}
        <div className="flex-1 container mx-auto px-6 -mt-12 relative z-20 flex justify-center items-center">
          <div className="max-w-4xl w-full bg-white rounded-xl shadow-xl p-4 md:p-6">
            <div className="flex flex-col space-y-4">
              {respuestas.map((respuesta, index) => (
                <div key={index} className="flex flex-col sm:flex-row border rounded-lg overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md">
                  {/* Título de la pregunta */}
                  <div className="py-2 px-3 md:px-4 font-medium bg-[#f0f7ff] text-[#0033A0] 
                    sm:w-1/2 border-b sm:border-b-0 sm:border-r border-[#e4ebf5] flex items-center">
                    <i className={`
                      ${index === 0 ? 'fa-solid fa-earth-americas' : ''}
                      ${index === 1 ? 'fa-solid fa-cloud-sun' : ''}
                      ${index === 2 ? 'fa-solid fa-person-hiking' : ''}
                      ${index === 3 ? 'fa-solid fa-hotel' : ''}
                      ${index === 4 ? 'fa-regular fa-calendar' : ''}
                      ${index === 5 ? 'fa-solid fa-user' : ''}
                      text-[#75B000] mr-3
                    `}></i>
                    <span>
                      {index === 0 && "Preferencia Destino"}
                      {index === 1 && "Preferencia Climática"}
                      {index === 2 && "Preferencia Actividad"}
                      {index === 3 && "Preferencia Alojamiento"}
                      {index === 4 && "Duración viaje"}
                      {index === 5 && "Edad"}
                    </span>
                  </div>
                  
                  {/* Respuesta */}
                  <div className="py-2 px-3 md:px-4 text-gray-700 bg-white sm:w-1/2 flex items-center">
                    <span className="font-medium">{respuesta}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4">
              <button
                type="button"
                onClick={volverAtras}
                className="w-full sm:w-auto px-5 py-2 bg-white border border-[#0033A0] text-[#0033A0] rounded-lg shadow-sm transition-all duration-300 hover:bg-[#f0f7ff] flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-arrow-left"></i> Modificar respuestas
              </button>
              <button
                type="button"
                onClick={enviarDestino}
                className="w-full sm:w-auto px-5 py-2 bg-gradient-to-r from-[#0033A0] to-[#0055CC] text-white rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-paper-plane"></i> Confirmar y continuar
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer - simplified and reduced height */}
      <div className="bg-[#0033A0] text-white py-3 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2">
            <div className="flex items-center gap-2">
              <img 
                src="https://www.amadeus.com/static/custom/resources/20230829162608/dist/images/header-logo.svg" 
                alt="Amadeus" 
                className="h-5 brightness-0 invert"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "https://cdn.icon-icons.com/icons2/2699/PNG/512/amadeus_logo_icon_170290.png";
                }}
              />
              <span className="font-medium text-sm">Travel Technology</span>
            </div>
            <div className="text-xs opacity-70">
              © {new Date().getFullYear()} Null Pointers. Todos los derechos reservados.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
