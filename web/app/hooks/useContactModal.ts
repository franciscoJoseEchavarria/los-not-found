import { useState, useEffect, useCallback } from "react";
import { getTokenFromCookiesClient } from "~/utils/cookieUtils";
import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG } from "~/utils/emailConfig";
import { API_URL } from "~/constants/api";

interface Destination {
  nombre: string;
  nombre_continente: string;
  id: number;
  comidaTipica: string;
  createdAt: string;
  idioma: string;
  imgUrl: string;
  lugarImperdible: string;
  pais: string;
  continentesId: number;
  continentes: null;
}

interface User {
  nombre: string;
  email: string;
}

export function useContactModal(isOpen: boolean, user: User | null) {
  const [emailSubject, setEmailSubject] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [emailHtmlContent, setEmailHtmlContent] = useState("");
  const [destinosDelUsuario, setDestinosDelUsuario] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Configuración inicial de EmailJS
  useEffect(() => {
    // Inicializar EmailJS
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
  }, []);

  const loadUserDestinations = useCallback(async (email: string) => {
    if (!email) return;
    
    setIsLoading(true);
    console.log({email})
    try {
      // Obtenemos el token de autenticación
      const token = getTokenFromCookiesClient();
      
      if (!token) {
        throw new Error("Token de autenticación no encontrado");
      }
      
      // Usamos el endpoint específico con el email del usuario
      const apiUrl = `${API_URL}/api/Destinos/by-email/${email}`;
      console.log("Llamando a API:", apiUrl);
      
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      // Parseamos la respuesta JSON
      const data = await response.json();
      console.log("Respuesta de la API:", data);
      
      // Guardamos los destinos en el estado
      setDestinosDelUsuario(data);
      
      if (data && data.length > 0) {
        console.log(`Se encontraron ${data.length} destinos para el usuario`);
      } else {
        console.log("No se encontraron destinos para el usuario");
      }
    } catch (error) {
      console.error("Error al cargar destinos:", error);
      setErrorMessage("Error al cargar los destinos. Revisa la consola para más detalles.");
      setTimeout(() => setErrorMessage(null), 3000);
      setDestinosDelUsuario([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const generateEmailContent = useCallback((usuario: User, destinos: Destination[]) => {
    // Generar un asunto predeterminado
    const subject = `Descubre tus destinos ideales con Amadeus, ${usuario.nombre}`;
    setEmailSubject(subject);
    
    // Versión de texto plano
    let content = `Estimado/a ${usuario.nombre},\n\n`;
    
    // Versión HTML
    let htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="padding: 20px">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="/imagenes/amadeus-logo-dark-sky.png" alt="Amadeus Logo" style="max-height: 60px;" />
          </div>
          <p style="font-size: 16px; line-height: 1.5; color: #333;">Estimado/a ${usuario.nombre},</p>
    `;
    
    if (destinos && destinos.length > 0) {
      // Agrupar destinos por continente
      const destinosPorContinente: { [continente: string]: Destination[] } = {};
      
      destinos.forEach((destino: Destination) => {
        // Obtener el nombre del continente basado en el ID
        let continente = "Desconocido";
        switch (destino.continentesId) {
          case 1: continente = "Asia"; break;
          case 2: continente = "America"; break;
          case 3: continente = "Europa"; break;
        }
        
        if (!destinosPorContinente[continente]) {
          destinosPorContinente[continente] = [];
        }
        destinosPorContinente[continente].push(destino);
      });
      
      // Texto plano
      content += `Hemos notado tu interés en los siguientes destinos: ${destinos
        .map((d: Destination) => {
          let continente = "Desconocido";
          switch (d.continentesId) {
            case 1: continente = "Asia"; break;
            case 2: continente = "America"; break;
            case 3: continente = "Europa"; break;
          }
          return `${d.nombre} (${continente})`;
        })
        .join(", ")}.\n\n`;
      
      // HTML
      htmlContent += `
        <p style="font-size: 16px; line-height: 1.5; color: #333;">
          Hemos notado tu interés en los siguientes destinos:
        </p>
        
        <div style="display: flex; flex-wrap: wrap; gap: 50px; margin: 20px 0; ">
      `;
      
      // Añadir imágenes de destinos en HTML
      destinos.forEach((destino: Destination) => {
        const fallbackImgUrl = `https://placehold.co/300x200?text=${destino.nombre}`;
        const imgSrc = destino.imgUrl || fallbackImgUrl;
        const nombreDestino = destino.nombre;
        
        // Obtener el nombre del continente basado en el ID
        let continenteNombre = "Desconocido";
        switch (destino.continentesId) {
          case 1: continenteNombre = "Asia"; break;
          case 2: continenteNombre = "America"; break;
          case 3: continenteNombre = "Europa"; break;
        }
        
        htmlContent += `
          <div style="width: 180px; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 15px;">
            <div style="height: 120px; overflow: hidden;">
              <img 
                src="${imgSrc}" 
                alt="${nombreDestino}" 
                style="width: 100%; height: 100%; object-fit: cover;"
              />
            </div>
            <div style="padding: 10px; background-color: #f8f9fa; height: 100%;">
              <h3 style="margin: 0 0 5px 0; font-size: 14px; color: #333;">${nombreDestino}</h3>
              <p style="margin: 0; font-size: 12px; color: #666;">${continenteNombre}</p>
            </div>
          </div>
        `;
      });
      
      htmlContent += `</div>`;
      
      // Texto plano
      content += `Amadeus tiene ofertas exclusivas para estos destinos que te encantarán:\n\n`;
      
      // HTML 
      htmlContent += `
        <p style="font-size: 16px; line-height: 1.5; color: #333; margin-top: 20px;">
          <strong>Amadeus tiene ofertas exclusivas para estos destinos que te encantarán:</strong>
        </p>
      `;
      
      // Añadir recomendaciones por continente
      // Texto plano
      content += "OPCIONES DE VUELO RECOMENDADAS:\n";
      Object.entries(destinosPorContinente).forEach(([continente, lugares]) => {
        content += `* Para ${continente}: Vuelos directos y con escala hacia ${lugares.map(d => d.nombre).join(", ")} con las mejores aerolíneas de cada región y descuentos de hasta 30%.\n`;
      });
      
      // HTML
      htmlContent += `
        <div style="background-color: #f1f8ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <h3 style="margin: 0 0 10px 0; color: #0066cc; font-size: 16px;">OPCIONES DE VUELO RECOMENDADAS:</h3>
          <ul style="margin: 0; padding-left: 20px;">
      `;
      
      Object.entries(destinosPorContinente).forEach(([continente, lugares]) => {
        const destinosNombres = lugares.map(d => d.nombre).join(", ");
        
        htmlContent += `
          <li style="margin-bottom: 10px; line-height: 1.4;">
            <strong>Para ${continente}:</strong> Vuelos directos y con escala hacia ${destinosNombres} 
            con las mejores aerolíneas de cada región y descuentos de hasta 30%.
          </li>
        `;
      });
      
      htmlContent += `
          </ul>
        </div>
      `;
      
      // Texto plano
      content += "\nALOJAMIENTOS DE LUJO SELECCIONADOS:\n";
      Object.entries(destinosPorContinente).forEach(([continente, lugares]) => {
        content += `* En ${continente}: Hoteles de 4 y 5 estrellas en ${lugares.map(d => d.nombre).join(", ")} con experiencias exclusivas y tarifas preferenciales.\n`;
      });
      
      // HTML
      htmlContent += `
        <div style="background-color: #fff8f1; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <h3 style="margin: 0 0 10px 0; color: #cc6600; font-size: 16px;">ALOJAMIENTOS DE LUJO SELECCIONADOS:</h3>
          <ul style="margin: 0; padding-left: 20px;">
      `;
      
      Object.entries(destinosPorContinente).forEach(([continente, lugares]) => {
        const destinosNombres = lugares.map(d => d.nombre).join(", ");
        
        htmlContent += `
          <li style="margin-bottom: 10px; line-height: 1.4;">
            <strong>En ${continente}:</strong> Hoteles de 4 y 5 estrellas en ${destinosNombres} 
            con experiencias exclusivas y tarifas preferenciales.
          </li>
        `;
      });
      
      htmlContent += `
          </ul>
        </div>
      `;
      
      // Añadir detalles culturales si están disponibles
      if (destinos.some((d: Destination) => d.comidaTipica || d.idioma || d.lugarImperdible)) {
        // Texto plano
        content += "\nDETALLES CULTURALES QUE TE ENCANTARÁN:\n";
        
        // HTML
        htmlContent += `
          <div style="background-color: #f1fff8; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h3 style="margin: 0 0 10px 0; color: #00a651; font-size: 16px;">DETALLES CULTURALES QUE TE ENCANTARÁN:</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 15px; justify-content: space-between;">
        `;
        
        destinos.forEach((destino: Destination) => {
          // Texto plano
          content += `* ${destino.nombre}: `;
          const detalles = [];
          if (destino.lugarImperdible) detalles.push(`Visita imperdible a ${destino.lugarImperdible}`);
          if (destino.comidaTipica) detalles.push(`Prueba la gastronomía local como ${destino.comidaTipica}`);
          if (destino.idioma) detalles.push(`Idioma: ${destino.idioma}`);
          content += detalles.join(", ") + "\n";
          
          // HTML solo si hay detalles
          if (detalles.length > 0) {
            const fallbackImgUrl = `https://placehold.co/120x120?text=${destino.nombre}`;
            const imgSrc = destino.imgUrl || fallbackImgUrl;
            const nombreDestino = destino.nombre;
            
            let detallesHtml = "";
            if (destino.lugarImperdible) detallesHtml += `<li>Visita imperdible a ${destino.lugarImperdible}</li>`;
            if (destino.comidaTipica) detallesHtml += `<li>Prueba la gastronomía local como ${destino.comidaTipica}</li>`;
            if (destino.idioma) detallesHtml += `<li>Idioma: ${destino.idioma}</li>`;
            
            htmlContent += `
              <div style="flex: 1; min-width: 250px; background-color: white; border-radius: 5px; padding: 10px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                  <div style="width: 60px; height: 60px; border-radius: 4px; overflow: hidden;">
                    <img 
                      src="${imgSrc}" 
                      alt="${nombreDestino}" 
                      style="width: 100%; height: 100%; object-fit: cover;" 
                    />
                  </div>
                  <h4 style="margin: 0; font-size: 16px; color: #333;">${nombreDestino}</h4>
                </div>
                <ul style="margin: 0; padding-left: 20px; font-size: 14px;">
                  ${detallesHtml}
                </ul>
              </div>
            `;
          }
        });
        
        htmlContent += `
            </div>
          </div>
        `;
      }
      
      // Texto plano
      content += `\nTodas nuestras ofertas incluyen:\n- Cancelación gratuita hasta 48 horas antes del viaje\n- Seguro de viaje premium\n- Servicio de concierge disponible 24/7\n- Traslados al aeropuerto incluidos en reservas premium\n\n`;
      
      // HTML
      htmlContent += `
        <div style="background-color: #efefef; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <h3 style="margin: 0 0 10px 0; color: #444; font-size: 16px;">TODAS NUESTRAS OFERTAS INCLUYEN:</h3>
          <ul style="margin: 0; padding-left: 20px;">
            <li style="margin-bottom: 8px;">Cancelación gratuita hasta 48 horas antes del viaje</li>
            <li style="margin-bottom: 8px;">Seguro de viaje premium</li>
            <li style="margin-bottom: 8px;">Servicio de concierge disponible 24/7</li>
            <li style="margin-bottom: 8px;">Traslados al aeropuerto incluidos en reservas premium</li>
          </ul>
        </div>
      `;
    } else {
      // Sin destinos - Texto plano
      content += `Nos encantaría ayudarte a descubrir nuevos destinos que se ajusten a tus preferencias de viaje.\n\n`;
      content += `Amadeus ofrece las mejores tarifas en vuelos y hospedaje para tus próximas vacaciones, con opciones para todo tipo de presupuesto y estilo de viaje.\n\n`;
      content += `Algunas de nuestras ofertas actuales incluyen:\n- Vuelos directos a Europa, Asia y América\n- Alojamientos exclusivos con descuentos de hasta 40%\n- Paquetes todo incluido a destinos paradisíacos\n- Experiencias de viaje personalizadas y únicas\n\n`;
      
      // Sin destinos - HTML
      htmlContent += `
        <p style="font-size: 16px; line-height: 1.5; color: #333;">
          Nos encantaría ayudarte a descubrir nuevos destinos que se ajusten a tus preferencias de viaje.
        </p>
        
        <p style="font-size: 16px; line-height: 1.5; color: #333;">
          Amadeus ofrece las mejores tarifas en vuelos y hospedaje para tus próximas vacaciones, 
          con opciones para todo tipo de presupuesto y estilo de viaje.
        </p>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <h3 style="margin: 0 0 10px 0; color: #333; font-size: 16px;">ALGUNAS DE NUESTRAS OFERTAS ACTUALES INCLUYEN:</h3>
          <ul style="margin: 0; padding-left: 20px;">
            <li style="margin-bottom: 8px;">Vuelos directos a Europa, Asia y América</li>
            <li style="margin-bottom: 8px;">Alojamientos exclusivos con descuentos de hasta 40%</li>
            <li style="margin-bottom: 8px;">Paquetes todo incluido a destinos paradisíacos</li>
            <li style="margin-bottom: 8px;">Experiencias de viaje personalizadas y únicas</li>
          </ul>
        </div>
        
        <div style="margin: 20px 0; display: flex; justify-content: space-between; gap: 15px;">
          <div style="flex: 1; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <img src="${Array.isArray(destinos) && destinos.length > 0 ? destinos[0].imgUrl : 'https://placehold.co/300x200?text=Destino'}" 
                 alt="${Array.isArray(destinos) && destinos.length > 0 ? destinos[0].nombre : 'Destino'}" 
                 style="width: 100%; height: 120px; object-fit: cover;" />
            <div style="padding: 10px; background-color: #f8f9fa;">
              <h3 style="margin: 0; font-size: 14px; color: #333;">
                ${Array.isArray(destinos) && destinos.length > 0 ? destinos[0].nombre : 'Destino Popular'}
              </h3>
            </div>
          </div>
          <div style="flex: 1; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <img src="${Array.isArray(destinos) && destinos.length > 1 ? destinos[1].imgUrl : 'https://placehold.co/300x200?text=Destino'}" 
                 alt="${Array.isArray(destinos) && destinos.length > 1 ? destinos[1].nombre : 'Destino'}" 
                 style="width: 100%; height: 120px; object-fit: cover;" />
            <div style="padding: 10px; background-color: #f8f9fa;">
              <h3 style="margin: 0; font-size: 14px; color: #333;">
                ${Array.isArray(destinos) && destinos.length > 1 ? destinos[1].nombre : 'Destino Popular'}
              </h3>
            </div>
          </div>
        </div>
      `;
    }
    
    // Texto plano - final
    content += `¿Podemos ayudarte a planificar tu próxima aventura? Nuestros expertos en viajes están listos para ofrecerte asesoramiento personalizado y los mejores precios del mercado.\n\n`;
    content += `Saludos cordiales,\nEl equipo de Amadeus`;
    
    // HTML - final
    const footerContent = `
        <p style="font-size: 16px; line-height: 1.5; color: #333; margin-top: 20px;">
          ¿Podemos ayudarte a planificar tu próxima aventura? Nuestros expertos en viajes están listos para 
          ofrecerte asesoramiento personalizado y los mejores precios del mercado.
        </p>
        
        <p style="font-size: 16px; line-height: 1.5; color: #333; margin-top: 20px;">
          Saludos cordiales,<br>
          El equipo de Amadeus
        </p>
      </div>
    </div>
    `;
    
    htmlContent += footerContent;
    
    setEmailContent(content);
    setEmailHtmlContent(htmlContent);
  }, []);

  useEffect(() => {
    if (isOpen && user) {
      loadUserDestinations(user.email);
    }
  }, [isOpen, user, loadUserDestinations]);

  // Regenerar contenido del email cuando cambian los destinos
  useEffect(() => {
    if (user && destinosDelUsuario) {
      console.log("Regenerando contenido de email con destinos:", destinosDelUsuario);
      generateEmailContent(user, destinosDelUsuario);
    }
  }, [destinosDelUsuario, user, generateEmailContent]);

  const handleSendEmail = useCallback(async (recipientEmail?: string) => {
    try {
      const emailToUse = recipientEmail || user?.email;
      
      if (!emailToUse) {
        throw new Error("No se ha especificado un email destinatario");
      }

      console.log("Enviando email a:", emailToUse);
      console.log("Asunto:", emailSubject);
      
      // Si estamos en modo desarrollo y está activado el modo de prueba, no enviamos emails reales
      if (EMAILJS_CONFIG.IS_DEV_MODE) {
        console.log('Modo de desarrollo activo - El email no se enviará realmente');
        console.log('Datos del email:', {
          to: emailToUse,
          subject: emailSubject,
          content: emailContent,
          htmlContent: emailHtmlContent
        });
        
        // Simulamos un retardo para imitar el envío
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSuccessMessage('MODO DESARROLLO: El email se ha procesado correctamente (no se ha enviado realmente)');
        setTimeout(() => setSuccessMessage(null), 3000);
        return true;
      }
      
      // Preparar los datos para EmailJS
      const templateParams = {
        to_email: emailToUse,
        to_name: user?.nombre || "Cliente",
        subject: emailSubject,
        message: emailContent,
        html_content: emailHtmlContent
      };
      
      // Enviar el email usando EmailJS
      const response = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams
      );
      
      console.log('Email enviado con éxito!', response);
      setSuccessMessage('Email enviado con éxito! El destinatario lo recibirá en breve.');
      setTimeout(() => setSuccessMessage(null), 3000);
      return true;
    } catch (error) {
      console.error("Error al enviar el email:", error);
      setErrorMessage(`Error al enviar el email: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      setTimeout(() => setErrorMessage(null), 3000);
      return false;
    }
  }, [user, emailSubject, emailContent, emailHtmlContent]);

  return {
    emailSubject,
    setEmailSubject,
    emailContent,
    setEmailContent,
    emailHtmlContent,
    destinosDelUsuario,
    isLoading,
    previewMode,
    setPreviewMode,
    errorMessage,
    successMessage,
    handleSendEmail
  };
}

export type { Destination, User }; 