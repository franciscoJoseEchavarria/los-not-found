import { Link } from "@remix-run/react";
import { useSelectedDestination } from "~/hooks/useSelectedDestination";
import { useState } from "react";
import WhatsAppChat from "./WhatsAppChat";
import CallModal from "./CallModal";

export default function Plans() {
  const selectedDestination = useSelectedDestination();
  const [isWhatsAppChatOpen, setIsWhatsAppChatOpen] = useState(false);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("opciones");
  
  // Número de teléfono de atención al cliente
  const supportPhoneNumber = "573503611262";
  
  const handleOpenWhatsAppChat = () => {
    setIsWhatsAppChatOpen(true);
  };

  const handleCloseWhatsAppChat = () => {
    setIsWhatsAppChatOpen(false);
  };

  const handleOpenCallModal = () => {
    setIsCallModalOpen(true);
  };

  const handleCloseCallModal = () => {
    setIsCallModalOpen(false);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="w-full bg-[#f8f9fa] min-h-screen">
      {/* Navigation Bar */}
      <div className="bg-white shadow-sm border-b border-gray-100 py-4 px-8 flex justify-between items-center">
        <Link 
          to="/destino" 
          className="flex items-center gap-2 text-[#0033A0] hover:text-[#005EB8] transition-colors"
        >
          <i className="fa-solid fa-arrow-left text-sm"></i>
          <span className="text-sm font-medium">Volver a destinos</span>
        </Link>
      </div>

      <div className="w-full relative h-[50vh] min-h-[400px] bg-gradient-to-br from-[#0033A0] to-[#002169] overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('https://amadeus.com/static/custom/resources/20230829162608/dist/images/section-texture-bright.svg')] bg-center opacity-10"></div>
        
        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-[#002169] to-transparent"></div>
        <div className="absolute -bottom-16 -right-16 w-80 h-80 rounded-full bg-[#005EB8] opacity-20"></div>
        <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-[#75B000] opacity-10"></div>
        
        {/* Content */}
        <div className="container mx-auto h-full flex items-center justify-center px-6 relative z-10">
          {selectedDestination ? (
            <div className="flex flex-col md:flex-row items-center justify-center gap-16 lg:gap-32 w-full max-w-5xl">
              <div className="flex flex-col items-start max-w-md">
                <div className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full mb-3 inline-flex items-center">
                  <i className="fa-solid fa-globe text-[#75B000] mr-2"></i>
                  <span className="text-white/90 text-sm">Destino premium</span>
                </div>
                <h1 className="text-white text-4xl lg:text-5xl font-light mb-4">{selectedDestination.nombre}</h1>
                <p className="text-white/80 mb-6 leading-relaxed">
                  Descubre uno de los destinos más impresionantes que podrás encontrar. 
                  Te ofrecemos una experiencia única con todos los servicios que necesitas.
                </p>
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <i className="fa-solid fa-globe text-xs text-white/80"></i>
                    <span className="text-white/90 text-sm">{selectedDestination.pais}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <i className="fa-solid fa-comment text-xs text-white/80"></i>
                    <span className="text-white/90 text-sm">{selectedDestination.idioma}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <i className="fa-solid fa-calendar text-xs text-white/80"></i>
                    <span className="text-white/90 text-sm">Disponible todo el año</span>
                  </div>
                </div>
              </div>

              <div className="md:block">
                <div className="w-72 h-40 md:w-80 md:h-48 rounded-lg overflow-hidden shadow-2xl ring-2 ring-white/20 relative group">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                  <img 
                    src={selectedDestination.imgUrl} 
                    alt={selectedDestination.nombre} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <i key={star} className="fa-solid fa-star text-[#FFB700] text-xs"></i>
                          ))}
                        </div>
                        <span className="text-white text-sm">Excelente</span>
                      </div>
                      <div className="bg-[#75B000] text-white text-xs px-2 py-1 rounded">9.2</div>
                    </div>
                  </div>
                </div>
                <div className="mt-3 px-1">
                  <div className="flex items-center justify-between text-xs text-white/70">
                    <span>Fotos por Amadeus</span>
                    <span className="flex items-center gap-1">
                      <i className="fa-solid fa-camera"></i> 24 fotos disponibles
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="w-8 h-8 border-4 border-t-[#75B000] border-[#0033A0]/30 rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        {/* Bottom Curve */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 60" className="w-full h-auto fill-[#f8f9fa]" preserveAspectRatio="none">
            <path d="M0,0V60H1440V0C1440,0,1320,60,720,60C120,60,0,0,0,0Z"></path>
          </svg>
        </div>
      </div>

      {/* Content Sections */}
      <div className="container mx-auto px-6 -mt-12 relative z-20">
        <div className="max-w-5xl mx-auto">
          {/* Travel Options Section */}
          <div className="bg-white rounded-lg shadow-xl mb-16">
            {/* Amadeus-style Navigation Header */}
            <div className="bg-[#f0f7ff] rounded-t-lg border-b border-[#e4ebf5] px-6 py-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <img 
                    src="https://www.amadeus.com/static/custom/resources/20230829162608/dist/images/header-logo.svg" 
                    alt="Amadeus" 
                    className="h-6"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "https://cdn.icon-icons.com/icons2/2699/PNG/512/amadeus_logo_icon_170290.png";
                    }}
                  />
                  <span className="text-[#0033A0] font-medium">Travel Technology</span>
                </div>
                <div className="flex flex-wrap gap-4">
                  <a 
                    href="https://amadeus.com/en" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0033A0] text-sm hover:text-[#002169] transition-colors"
                  >
                    Visitar Amadeus
                  </a>
                  <span className="text-gray-300 hidden sm:inline">|</span>
                  <a 
                    href="https://amadeus.com/en/portfolio" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0033A0] text-sm hover:text-[#002169] transition-colors"
                  >
                    Soluciones
                  </a>
                </div>
              </div>
            </div>
            
            {/* Info Panel */}
            <div className="py-6 px-8 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#f0f7ff] flex items-center justify-center">
                  <i className="fa-solid fa-info text-[#0033A0]"></i>
                </div>
                <div>
                  <h4 className="text-[#0033A0] font-medium">Tecnología de Amadeus</h4>
                  <p className="text-gray-500 text-sm">Este viaje está impulsado por la tecnología líder en la industria de viajes</p>
                </div>
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex justify-center">
                <div className="flex border-b border-gray-100 relative">
                  <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gray-100"></div>
                  <button 
                    className={`px-6 py-3 font-medium relative z-10 transition-colors ${
                      activeTab === "opciones" 
                        ? "text-[#0033A0] border-b-2 border-[#0033A0]" 
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                    onClick={() => handleTabChange("opciones")}
                    data-active={activeTab === "opciones"}
                  >
                    Opciones de viaje
                  </button>
                  <button 
                    className={`px-6 py-3 font-medium relative z-10 transition-colors ${
                      activeTab === "detalles" 
                        ? "text-[#0033A0] border-b-2 border-[#0033A0]" 
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                    onClick={() => handleTabChange("detalles")}
                    data-active={activeTab === "detalles"}
                  >
                    Detalles del destino
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section Divider */}
          <div className="flex justify-between items-center mb-10">
            <div className="h-[1px] bg-gray-200 flex-grow"></div>
            <div className="px-4 text-gray-400 text-xs uppercase tracking-wider font-medium">Tu experiencia</div>
            <div className="h-[1px] bg-gray-200 flex-grow"></div>
          </div>

          {/* Content based on active tab */}
          <div className={activeTab === "opciones" ? "block" : "hidden"}>
            {/* Accommodations */}
            <div className="mb-20">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0033A0] to-[#0055cc] flex items-center justify-center shadow-md">
                  <i className="fa-solid fa-hotel text-white"></i>
                </div>
                <div>
                  <h2 className="text-[#0033A0] text-2xl font-light">Alojamiento recomendado</h2>
                  <p className="text-gray-500 text-sm">Seleccionado especialmente para ti</p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <span className="text-sm text-gray-500">Ver más opciones</span>
                  <i className="fa-solid fa-chevron-right text-[#0033A0] text-xs"></i>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all hover:-translate-y-1 hover:shadow-xl duration-300">
                <div className="grid grid-cols-1 md:grid-cols-12">
                  <div className="md:col-span-5 h-full">
                    <a
                      href="https://www.palladiumhotelgroup.com/es/hoteles/mexico/costamujerescancun/trs-coral-hotel"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block h-full"
                    >
                      <div className="h-full min-h-[320px] overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-black/50 via-black/20 to-transparent z-10"></div>
                        <img 
                          src="/imagenes/trs-cancun.jpg" 
                          alt="TRS Coral Hotel" 
                          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                        />
                        <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-sm text-[#0033A0] text-xs font-semibold px-3 py-1 rounded-full shadow-md flex items-center">
                          <i className="fa-solid fa-award text-[#75B000] mr-1.5"></i> 
                          Recomendado
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 to-transparent pt-20 pb-4 px-6">
                          <h3 className="text-white text-2xl font-medium mb-2">TRS Coral Hotel</h3>
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <i key={star} className="fa-solid fa-star text-[#FFB700] text-xs"></i>
                              ))}
                            </div>
                            <span className="text-white/80 text-xs">All inclusive</span>
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                  <div className="md:col-span-7 p-8 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-[#f5f9ff] flex items-center justify-center mr-3">
                            <i className="fa-solid fa-location-dot text-[#0033A0]"></i>
                          </div>
                          <div>
                            <div className="text-gray-800 font-medium">Cancún, Playa del Carmen</div>
                            <div className="text-gray-500 text-sm">A 15 minutos de la playa</div>
                          </div>
                        </div>
                        <div className="bg-[#f0f8e8] text-[#3d7000] text-xs px-3 py-1.5 rounded-full font-medium flex items-center">
                          <i className="fa-solid fa-thumbs-up mr-1.5"></i>
                          9.2 Excelente
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-sm leading-relaxed mb-6">
                        Se sitúa en Cancún, playa del Carmen, cuenta con zona privada de
                        playa, piscina al aire libre, wifi gratis en todo el hotel y 13
                        restaurantes con diferentes menús.
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center gap-2">
                          <i className="fa-solid fa-umbrella-beach text-[#0033A0]"></i>
                          <span className="text-gray-600 text-sm">Playa privada</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <i className="fa-solid fa-wifi text-[#0033A0]"></i>
                          <span className="text-gray-600 text-sm">WiFi gratis</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <i className="fa-solid fa-swimming-pool text-[#0033A0]"></i>
                          <span className="text-gray-600 text-sm">Piscina infinita</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <i className="fa-solid fa-utensils text-[#0033A0]"></i>
                          <span className="text-gray-600 text-sm">13 restaurantes</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-end justify-between mt-6 pt-6 border-t border-gray-100">
                      <div>
                        <span className="text-gray-400 text-xs">Precio por noche desde</span>
                        <div className="flex items-baseline">
                          <span className="text-[#0033A0] text-2xl font-semibold">$360</span>
                          <span className="text-[#0033A0] ml-1">USD</span>
                        </div>
                        <span className="text-[#75B000] text-xs font-medium">Cancelación gratuita</span>
                      </div>
                      <a 
                        href="https://www.palladiumhotelgroup.com/es/hoteles/mexico/costamujerescancun/trs-coral-hotel"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#0033A0] hover:bg-[#002169] text-white font-medium rounded-lg transition-colors shadow-md hover:shadow-lg"
                      >
                        Reservar ahora
                        <i className="fa-solid fa-arrow-right text-xs"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Flights */}
            <div className="mb-20">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0033A0] to-[#0055cc] flex items-center justify-center shadow-md">
                  <i className="fa-solid fa-plane text-white"></i>
                </div>
                <div>
                  <h2 className="text-[#0033A0] text-2xl font-light">Vuelos recomendados</h2>
                  <p className="text-gray-500 text-sm">Las mejores opciones para tu viaje</p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <span className="text-sm text-gray-500">Ver más opciones</span>
                  <i className="fa-solid fa-chevron-right text-[#0033A0] text-xs"></i>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all hover:-translate-y-1 hover:shadow-xl duration-300">
                <div className="p-1">
                  <div className="flex justify-end px-4 py-2">
                    <div className="bg-[#f0f8e8] text-[#3d7000] text-xs px-3 py-1.5 rounded-full font-medium flex items-center">
                      <i className="fa-solid fa-bolt mr-1.5"></i>
                      Mejor opción
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-5 p-6 gap-6">
                    <div className="md:col-span-1 flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-white p-1 shadow-md flex items-center justify-center">
                        <a
                          href="https://www.avianca.com/es/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img 
                            src="/imagenes/avion-avianca.jpg" 
                            alt="Avianca" 
                            className="w-full h-full object-cover rounded-full"
                          />
                        </a>
                      </div>
                    </div>
                    
                    <div className="md:col-span-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-medium text-[#0033A0] mb-1">Avianca</h3>
                          <p className="text-gray-500 text-sm mb-6">
                            Aerolínea Colombiana premium, con más de 104 años de trayectoria,
                            volando a más de 104 destinos internacionales.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center py-1 px-3 bg-gray-100 rounded-full text-xs text-gray-600">
                          <i className="fa-solid fa-plane-departure mr-2 text-[#0033A0]"></i>
                          Vuelo directo
                        </div>
                        <div className="flex items-center py-1 px-3 bg-gray-100 rounded-full text-xs text-gray-600">
                          <i className="fa-solid fa-clock mr-2 text-[#0033A0]"></i>
                          4h 25m
                        </div>
                        <div className="flex items-center py-1 px-3 bg-gray-100 rounded-full text-xs text-gray-600">
                          <i className="fa-solid fa-suitcase mr-2 text-[#0033A0]"></i>
                          Equipaje incluido
                        </div>
                      </div>
                      
                      <div className="relative flex items-center pb-2">
                        <div className="flex flex-col items-center">
                          <div className="w-4 h-4 rounded-full bg-[#0033A0] z-10 shadow-md"></div>
                          <div className="text-[#0033A0] font-medium mt-1">08:15</div>
                          <div className="text-gray-500 text-xs">BOG</div>
                        </div>
                        
                        <div className="flex-grow mx-4">
                          <div className="relative h-0.5 bg-gradient-to-r from-[#0033A0] to-[#75B000] rounded-full">
                            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-white text-gray-400 text-xs px-2">
                              4h 25m
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-center">
                          <div className="w-4 h-4 rounded-full bg-[#75B000] z-10 shadow-md"></div>
                          <div className="text-[#0033A0] font-medium mt-1">12:40</div>
                          <div className="text-gray-500 text-xs">CUN</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="md:col-span-1 flex flex-col justify-between items-end">
                      <div className="flex items-center gap-2">
                        <i className="fa-solid fa-briefcase text-gray-400"></i>
                        <i className="fa-solid fa-wifi text-gray-400"></i>
                        <i className="fa-solid fa-utensils text-gray-400"></i>
                      </div>
                      
                      <div className="text-right">
                        <span className="text-gray-400 text-xs">Precio por persona</span>
                        <div className="flex items-baseline justify-end">
                          <span className="text-[#0033A0] text-2xl font-semibold">$520</span>
                          <span className="text-[#0033A0] ml-1">USD</span>
                        </div>
                        <a 
                          href="https://www.avianca.com/es/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 px-5 py-2 mt-2 bg-[#0033A0] hover:bg-[#002169] text-white text-sm font-medium rounded-lg w-full transition-colors shadow-sm hover:shadow-md"
                        >
                          Seleccionar
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Help Box */}
            <div className="mb-16">
              <div className="bg-gradient-to-r from-[#f8fbff] to-[#f0f7ff] rounded-xl p-8 shadow-md">
                <div className="flex gap-6">
                  <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center flex-shrink-0">
                    <i className="fa-solid fa-headset text-[#0033A0] text-xl"></i>
                  </div>
                  <div>
                    <h3 className="text-[#0033A0] font-medium text-xl mb-2">¿Necesitas ayuda con tu viaje?</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      Nuestros expertos en viajes están disponibles 24/7 para ayudarte a planificar 
                      la experiencia perfecta. Obtén asistencia personalizada para cualquier duda.
                    </p>
                    <div className="flex gap-4">
                      <button 
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0033A0] hover:bg-[#002169] text-white text-sm font-medium rounded-lg transition-colors shadow-sm hover:shadow-md"
                        onClick={handleOpenWhatsAppChat}
                        aria-label="Chatear ahora"
                      >
                        <i className="fa-solid fa-comment-dots"></i>
                        Chatear ahora
                      </button>
                      <button 
                        className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#0033A0] text-[#0033A0] hover:bg-[#f0f7ff] text-sm font-medium rounded-lg transition-colors"
                        onClick={handleOpenCallModal}
                      >
                        <i className="fa-solid fa-phone"></i>
                        Llamar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Banner */}
            <div className="mb-16 rounded-xl overflow-hidden shadow-xl relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#002169]/80 to-[#0033A0]/50 z-10 group-hover:from-[#002169]/70 group-hover:to-[#0033A0]/40 transition-all duration-500"></div>
              <img 
                src="/imagenes/trs-cancun.jpg" 
                alt="Promoción especial" 
                className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 z-20 flex items-center justify-between px-10">
                <div>
                  <div className="text-[#75B000] text-sm font-medium mb-2">OFERTA EXCLUSIVA</div>
                  <h3 className="text-white text-2xl font-light mb-3">Reserva tu paquete completo</h3>
                  <p className="text-white/80 text-sm max-w-md">
                    Obtén un 15% de descuento al reservar vuelo + hotel + traslados
                  </p>
                </div>
                <a 
                  href="https://amadeus.com/en/travel-sellers/overview"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-[#0033A0] px-6 py-3 rounded-lg font-medium shadow-lg hover:bg-[#f0f7ff] transition-colors"
                >
                  Ver ofertas
                </a>
              </div>
            </div>
          </div>

          <div className={activeTab === "detalles" ? "block" : "hidden"}>
            {/* Detalles del destino content */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-16">
              <div className="mb-8">
                <h2 className="text-2xl text-[#0033A0] font-light mb-4">Información del destino</h2>
                {selectedDestination && (
                  <>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-full bg-[#f0f7ff] flex items-center justify-center">
                        <i className="fa-solid fa-map-marker-alt text-[#0033A0]"></i>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">{selectedDestination.nombre}</h3>
                        <p className="text-gray-500 text-sm">{selectedDestination.pais}</p>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {selectedDestination.nombre} es un destino turístico impresionante con hermosas playas, cultura vibrante y 
                      una gran variedad de actividades para todos los gustos. Disfruta de la cocina local, 
                      paisajes espectaculares y una experiencia inolvidable.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div className="bg-[#f8f9fa] p-4 rounded-lg">
                        <h4 className="text-[#0033A0] font-medium mb-2">Clima</h4>
                        <p className="text-gray-600 text-sm">Temperatura promedio de 28°C durante todo el año con clima tropical.</p>
                      </div>
                      <div className="bg-[#f8f9fa] p-4 rounded-lg">
                        <h4 className="text-[#0033A0] font-medium mb-2">Moneda</h4>
                        <p className="text-gray-600 text-sm">La moneda local es el Peso Mexicano (MXN).</p>
                      </div>
                      <div className="bg-[#f8f9fa] p-4 rounded-lg">
                        <h4 className="text-[#0033A0] font-medium mb-2">Idioma</h4>
                        <p className="text-gray-600 text-sm">El idioma oficial es el Español, pero en zonas turísticas se habla inglés.</p>
                      </div>
                      <div className="bg-[#f8f9fa] p-4 rounded-lg">
                        <h4 className="text-[#0033A0] font-medium mb-2">Mejor época para visitar</h4>
                        <p className="text-gray-600 text-sm">De noviembre a abril, evitando la temporada de huracanes.</p>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-100 pt-6">
                      <h4 className="text-[#0033A0] font-medium mb-3">Atracciones principales</h4>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2">
                          <i className="fa-solid fa-check text-[#75B000] text-sm"></i>
                          <span className="text-gray-600">Playas de arena blanca</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <i className="fa-solid fa-check text-[#75B000] text-sm"></i>
                          <span className="text-gray-600">Sitios arqueológicos mayas</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <i className="fa-solid fa-check text-[#75B000] text-sm"></i>
                          <span className="text-gray-600">Buceo en arrecifes de coral</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <i className="fa-solid fa-check text-[#75B000] text-sm"></i>
                          <span className="text-gray-600">Parques temáticos y reservas naturales</span>
                        </li>
                      </ul>
                    </div>
                  </>
                )}
              </div>
              
              <a 
                href="https://amadeus.com/en/travel-sellers/overview"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#0033A0] font-medium hover:text-[#002169]"
              >
                <span>Ver más información sobre este destino</span>
                <i className="fa-solid fa-arrow-right text-xs"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Modales */}
      <WhatsAppChat 
        isOpen={isWhatsAppChatOpen} 
        onClose={handleCloseWhatsAppChat} 
        phoneNumber={supportPhoneNumber}
      />
      
      <CallModal 
        isOpen={isCallModalOpen} 
        onClose={handleCloseCallModal}
        phoneNumber={supportPhoneNumber}
      />
    </div>
  );
}
