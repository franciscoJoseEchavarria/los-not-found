import { useState } from "react";
import { useUserRole } from "~/hooks/useUserRole";
import { logout } from "~/services/auth";
import { useNavigate } from "@remix-run/react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const userRole = useUserRole();
  const isAdmin = userRole === "ADMIN";
  const isAuthenticated = userRole !== null;
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="w-full">
      <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-sky-100/90 to-white/90 backdrop-blur-md shadow-md z-50">
        <div className="w-full px-3 md:px-5">
          <div className="flex justify-between h-16">
            {/* Logo section */}
            <div className="flex items-center pl-2">
              <a className="flex items-center h-full" href="/">
                <img
                  className="h-12 w-auto transition-transform duration-300 hover:scale-110"
                  src="/imagenes/amadeus-logo-dark-sky.png"
                  alt="logo"
                />
              </a>
            </div>
            
            {/* Desktop navigation */}
            <div className="hidden md:flex items-center pr-2">
              <ul className="flex items-center space-x-6 h-full">
                <li className="flex items-center h-full">
                  <a className="flex items-center text-gray-800 hover:text-sky-600 hover:scale-105 px-4 py-2 rounded-md text-base font-medium transition-all duration-300" href="/">Inicio</a>
                </li>
                <li className="flex items-center h-full">
                  <a
                    className="flex items-center text-gray-800 hover:text-sky-600 hover:scale-105 px-4 py-2 rounded-md text-base font-medium transition-all duration-300"
                    href="https://amadeus.com/es/contacto"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    Contacto
                  </a>
                </li>
                {isAdmin && (
                  <li className="flex items-center h-full">
                    <a className="flex items-center text-gray-800 hover:text-sky-600 hover:scale-105 px-4 py-2 rounded-md text-base font-medium transition-all duration-300" href="/reports/destinations">Reporte</a>
                  </li>
                )}
                <li className="flex items-center h-full">
                  <a
                    className="flex items-center text-gray-800 hover:text-sky-600 hover:scale-105 px-4 py-2 rounded-md text-base font-medium transition-all duration-300"
                    href="https://amadeus.com/en"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    Amadeus
                  </a>
                </li>
                {isAuthenticated && (
                  <li className="flex items-center h-full">
                    <button 
                      onClick={handleLogout}
                      className="flex items-center text-gray-800 hover:text-sky-600 hover:scale-105 p-2 rounded-md text-base font-medium transition-all duration-300"
                      title="Cerrar sesión"
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        strokeWidth={1.5} 
                        stroke="currentColor" 
                        className="w-6 h-6"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" 
                        />
                      </svg>
                    </button>
                  </li>
                )}
              </ul>
            </div>
            
            {/* Mobile menu button */}
            <div className="flex items-center md:hidden pr-2">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
                aria-expanded="false"
              >
                <span className="sr-only">Abrir menú</span>
                <svg 
                  className={`h-6 w-6 ${isOpen ? 'hidden' : 'block'}`}
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg 
                  className={`h-6 w-6 ${isOpen ? 'block' : 'hidden'}`}
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu, show/hide based on menu state */}
        <div className={`${isOpen ? 'block' : 'hidden'} md:hidden bg-white/95 backdrop-blur-sm shadow-lg`}>
          <div className="px-4 pt-2 pb-3 space-y-1">
            <a 
              href="/" 
              className="flex items-center px-3 py-2 rounded-md text-lg font-medium text-gray-800 hover:text-sky-600 hover:bg-gray-50 transition-colors duration-300"
            >
              Inicio
            </a>
            <a 
              href="https://amadeus.com/es/contacto" 
              className="flex items-center px-3 py-2 rounded-md text-lg font-medium text-gray-800 hover:text-sky-600 hover:bg-gray-50 transition-colors duration-300"
              target="_blank"
              rel="noreferrer noopener"
            >
              Contacto
            </a>
            {isAdmin && (
              <a 
                href="/reports/destinations" 
                className="flex items-center px-3 py-2 rounded-md text-lg font-medium text-gray-800 hover:text-sky-600 hover:bg-gray-50 transition-colors duration-300"
              >
                Reporte
              </a>
            )}
            <a 
              href="https://amadeus.com/en" 
              className="flex items-center px-3 py-2 rounded-md text-lg font-medium text-gray-800 hover:text-sky-600 hover:bg-gray-50 transition-colors duration-300"
              target="_blank"
              rel="noreferrer noopener"
            >
              Amadeus
            </a>
            {isAuthenticated && (
              <button 
                onClick={handleLogout}
                className="flex items-center justify-center px-3 py-2 rounded-md text-lg font-medium text-gray-800 hover:text-sky-600 hover:bg-gray-50 transition-colors duration-300 w-full"
                title="Cerrar sesión"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  strokeWidth={1.5} 
                  stroke="currentColor" 
                  className="w-6 h-6"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" 
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
