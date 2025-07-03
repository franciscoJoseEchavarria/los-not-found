import { useState, useEffect, useRef } from "react";

interface WhatsAppChatProps {
  isOpen: boolean;
  onClose: () => void;
  phoneNumber: string;
}

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

// Componente principal de chat
const WhatsAppChat = ({ isOpen, onClose, phoneNumber }: WhatsAppChatProps): JSX.Element => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { 
      text: "¡Hola! Soy tu asistente de viajes. ¿En qué puedo ayudarte hoy?", 
      isUser: false, 
      timestamp: new Date()
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // Efecto para mover el scroll al final cuando hay nuevos mensajes
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Formatear la hora del mensaje
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Simulación simple de envío de mensaje
  const sendMessage = () => {
    if (!message.trim()) return;
    
    // Añadir mensaje del usuario
    const userMessage = {
      text: message.trim(),
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setMessage("");
    setIsTyping(true);
    
    // Simular respuesta después de un tiempo
    setTimeout(() => {
      const botMessage = {
        text: "Gracias por tu mensaje. Un asesor se pondrá en contacto contigo pronto a través de WhatsApp al número +57 350-361-1262.",
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  // Función para abrir WhatsApp Web
  const openWhatsAppWeb = () => {
    window.open(`https://wa.me/${phoneNumber}`, '_blank');
  };

  // Si el modal no está abierto, no renderizar nada
  if (!isOpen) {
    return <></>;
  }

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div className="absolute bottom-6 right-6 w-full max-w-md rounded-xl shadow-2xl overflow-hidden pointer-events-auto">
        <div className="bg-white rounded-xl overflow-hidden">
          {/* Header */}
          <div className="bg-[#0033A0] text-white p-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-3">
                <i className="fa-solid fa-headset text-white"></i>
              </div>
              <div>
                <h3 className="font-medium">Asistente de Viajes</h3>
                <div className="text-xs text-white/80">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1.5 animate-pulse"></span>
                  En línea
                </div>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              aria-label="Cerrar chat"
            >
              <i className="fa-solid fa-times"></i>
            </button>
          </div>
          
          {/* Chat Messages */}
          <div className="p-4 h-96 overflow-y-auto bg-gray-50">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`mb-3 flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!msg.isUser && (
                  <div className="w-6 h-6 rounded-full bg-[#0033A0] flex items-center justify-center mr-2 flex-shrink-0 self-end mb-1">
                    <i className="fa-solid fa-headset text-white text-xs"></i>
                  </div>
                )}
                <div>
                  <div 
                    className={`max-w-xs p-3 rounded-lg ${
                      msg.isUser 
                        ? 'bg-[#0033A0] text-white rounded-tr-none' 
                        : 'bg-white text-gray-700 rounded-tl-none shadow'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <div className={`text-xs text-gray-400 mt-1 ${msg.isUser ? 'text-right' : 'text-left'}`}>
                    {formatTime(msg.timestamp)}
                  </div>
                </div>
                {msg.isUser && (
                  <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center ml-2 flex-shrink-0 self-end mb-1">
                    <i className="fa-solid fa-user text-gray-500 text-xs"></i>
                  </div>
                )}
              </div>
            ))}
            
            {/* Indicador de escritura */}
            {isTyping && (
              <div className="flex justify-start mb-3">
                <div className="w-6 h-6 rounded-full bg-[#0033A0] flex items-center justify-center mr-2 flex-shrink-0 self-end">
                  <i className="fa-solid fa-headset text-white text-xs"></i>
                </div>
                <div className="bg-white p-3 rounded-lg rounded-tl-none shadow inline-flex">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>
          
          {/* Input */}
          <div className="p-3 border-t border-gray-200 flex items-center">
            <textarea 
              className="flex-grow resize-none border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#0033A0] focus:border-transparent text-sm h-12 max-h-32"
              placeholder="Escribe tu mensaje aquí..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isTyping}
            />
            <button 
              className="ml-2 w-10 h-10 rounded-full bg-[#0033A0] text-white flex items-center justify-center hover:bg-[#002169] transition-colors disabled:opacity-50 disabled:hover:bg-[#0033A0]"
              onClick={sendMessage}
              disabled={!message.trim() || isTyping}
              aria-label="Enviar mensaje"
            >
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </div>
          
          {/* WhatsApp Button */}
          <div className="p-3 border-t border-gray-100 bg-gray-50">
            <button 
              onClick={openWhatsAppWeb} 
              className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-medium transition-colors"
              aria-label="Continuar en WhatsApp"
            >
              <i className="fa-brands fa-whatsapp text-lg"></i>
              Continuar en WhatsApp
            </button>
          </div>
          
          {/* Estilos para el indicador de escritura */}
          <style>
            {`
              .typing-indicator {
                width: 40px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-center;
              }
              
              .typing-indicator span {
                width: 8px;
                height: 8px;
                margin: 0 2px;
                background-color: #bbb;
                border-radius: 50%;
                display: inline-block;
                opacity: 0.4;
                animation: typing 1.4s infinite both;
              }
              
              .typing-indicator span:nth-child(2) {
                animation-delay: 0.2s;
              }
              
              .typing-indicator span:nth-child(3) {
                animation-delay: 0.4s;
              }
              
              @keyframes typing {
                0% { transform: translateY(0); }
                50% { transform: translateY(-5px); }
                100% { transform: translateY(0); }
              }
            `}
          </style>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppChat; 