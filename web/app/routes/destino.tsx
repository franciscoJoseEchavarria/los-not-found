import { useNavigate } from "@remix-run/react";
import { useAuth } from "~/hooks/useAuth";

interface Destino {
  id: number;
  comidaTipica: string;
  createdAt: string;
  idioma: string;
  imgUrl: string;
  lugarImperdible: string;
  nombre: string;
  pais: string;
  continentesId: number;
}

export default function Destino() {
  const navigate = useNavigate();
  const { authorized } = useAuth(["CLIENT", "ADMIN"]);

  if (!authorized) {
    navigate("login");
    return null;
  }

  const storedDestinos = sessionStorage.getItem("destinos");
  const destinos: Destino[] = storedDestinos ? JSON.parse(storedDestinos) : [];

  const destinoUno = destinos[0];
  const destinoDos = destinos[1];

  return (
    <div className="w-full bg-[#f8f9fa] h-[94vh] flex flex-col overflow-hidden">
      {/* Hero Section with gradient background - adapted from Plans */}
      <div className="w-full relative h-[25vh] bg-gradient-to-br from-[#0033A0] to-[#002169] overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('https://amadeus.com/static/custom/resources/20230829162608/dist/images/section-texture-bright.svg')] bg-center opacity-10"></div>
        
        {/* Back button integrated in hero */}
        <div className="absolute top-4 left-4 z-20">
          <button 
            className="flex items-center gap-2 text-white hover:text-[#75B000] transition-colors bg-[#0033A0]/40 backdrop-blur-sm px-4 py-2 rounded-lg"
            onClick={() => navigate("/resultados")}
          >
            <i className="fa-solid fa-arrow-left text-sm"></i>
            <span className="text-sm font-medium">Volver a Resultados</span>
          </button>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-[#002169] to-transparent"></div>
        <div className="absolute -bottom-16 -right-16 w-80 h-80 rounded-full bg-[#005EB8] opacity-20"></div>
        <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-[#75B000] opacity-10"></div>
        
        {/* Content */}
        <div className="container mx-auto h-full flex items-center justify-center px-6 relative z-10">
          <div className="text-center">
            <h1 className="text-white text-4xl lg:text-5xl font-light mb-4">Tus Destinos</h1>
            <p className="text-white/80 max-w-2xl mx-auto">
              Explora los destinos que mejor se adaptan a tus preferencias y descubre increíbles opciones para tu próximo viaje.
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

      {/* Content Sections */}
      <div className="container mx-auto px-6 mt-10 relative z-20 flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 pb-16">
          {[
            { destino: destinoUno, titulo: "Aventura en América", id: "America" },
            { destino: destinoDos, titulo: "Aventura en Europa", id: "Europa" },
          ].map(({ destino, titulo, id }) => (
            <section 
              key={id} 
              className="bg-white rounded-lg shadow-xl overflow-hidden flex flex-col h-[450px] transform transition-all duration-300 hover:-translate-y-1"
            >
              {/* Cabecera */}
              <div className="bg-gradient-to-r from-[#0033A0] to-[#3a8bff] p-4">
                <h2 className="text-white text-xl font-bold text-center">
                  {titulo}
                </h2>
              </div>

              {/* Nombre del destino */}
              <div className="py-4 text-center bg-[#f0f7ff]">
                <label htmlFor={`destino${id}`} className="sr-only">Nombre del destino</label>
                <input
                  value={destino?.nombre || ""}
                  className="text-2xl font-bold text-center bg-transparent border-none focus:outline-none w-full text-[#0033A0] animate-[fadeIn_1s_ease-in]"
                  type="text"
                  readOnly
                  id={`destino${id}`}
                  aria-label={`Nombre del destino ${id}`}
                />
              </div>

              {/* Imagen y detalles */}
              <div className="relative flex-1 overflow-hidden group">
                {/* Imagen */}
                <img 
                  src={destino?.imgUrl || "/imagenes/default.png"} 
                  alt={`Destino en ${id}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Overlay que aparece al hacer hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0033A0] to-[#0033A0]/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-center p-6">
                  <div className="space-y-5 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    {/* País */}
                    <div className="flex flex-col">
                      <label htmlFor={`pais${id}`} className="text-[#75B000] text-sm font-medium">País</label>
                      <input 
                        id={`pais${id}`}
                        className="bg-transparent text-white border-b border-[#75B000]/30 pb-1 focus:outline-none text-lg" 
                        type="text" 
                        value={destino?.pais || ""} 
                        readOnly
                        aria-label={`País de ${destino?.nombre || 'destino'}`}
                      />
                    </div>
                    
                    {/* Idioma */}
                    <div className="flex flex-col">
                      <label htmlFor={`idioma${id}`} className="text-[#75B000] text-sm font-medium">Idioma</label>
                      <input 
                        id={`idioma${id}`}
                        className="bg-transparent text-white border-b border-[#75B000]/30 pb-1 focus:outline-none text-lg" 
                        type="text" 
                        value={destino?.idioma || ""} 
                        readOnly
                        aria-label={`Idioma de ${destino?.nombre || 'destino'}`}
                      />
                    </div>
                    
                    {/* Lugar imperdible */}
                    <div className="flex flex-col">
                      <label htmlFor={`lugar${id}`} className="text-[#75B000] text-sm font-medium">Lugar Imperdible</label>
                      <input 
                        id={`lugar${id}`}
                        className="bg-transparent text-white border-b border-[#75B000]/30 pb-1 focus:outline-none text-lg" 
                        type="text" 
                        value={destino?.lugarImperdible || ""} 
                        readOnly
                        aria-label={`Lugar imperdible de ${destino?.nombre || 'destino'}`}
                      />
                    </div>
                    
                    {/* Comida típica */}
                    <div className="flex flex-col">
                      <label htmlFor={`comida${id}`} className="text-[#75B000] text-sm font-medium">Comida Típica</label>
                      <input 
                        id={`comida${id}`}
                        className="bg-transparent text-white border-b border-[#75B000]/30 pb-1 focus:outline-none text-lg" 
                        type="text" 
                        value={destino?.comidaTipica || ""} 
                        readOnly
                        aria-label={`Comida típica de ${destino?.nombre || 'destino'}`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Botón de explorar opciones */}
              <div className="p-4 bg-white border-t border-gray-100 flex justify-center">
                <button 
                  onClick={() => {
                    sessionStorage.setItem("selectedDestination", JSON.stringify(destino));
                    navigate("/plans")
                  }}
                  className="bg-gradient-to-r from-[#0033A0] to-[#0055CC] text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:shadow-lg hover:shadow-blue-200 transition-all duration-300 font-medium"
                  title="Explora tus opciones"
                  aria-label="Explora tus opciones"
                >
                  <span>Explorar opciones</span>
                  <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </section>
          ))}
        </div>
      </div>
      
      {/* Footer */}
      <div className="bg-[#0033A0] text-white py-6 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <img 
                src="https://www.amadeus.com/static/custom/resources/20230829162608/dist/images/header-logo.svg" 
                alt="Amadeus" 
                className="h-6 brightness-0 invert"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "https://cdn.icon-icons.com/icons2/2699/PNG/512/amadeus_logo_icon_170290.png";
                }}
              />
              <span className="font-medium">Travel Technology</span>
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