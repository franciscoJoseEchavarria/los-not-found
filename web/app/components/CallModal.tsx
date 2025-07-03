import { useState, useEffect } from "react";

interface CallModalProps {
  isOpen: boolean;
  onClose: () => void;
  phoneNumber: string;
}

const CallModal: React.FC<CallModalProps> = ({ isOpen, onClose, phoneNumber }) => {
  const [callStatus, setCallStatus] = useState<"dialing" | "connected" | "ended">("dialing");
  const [callTime, setCallTime] = useState(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (isOpen && callStatus === "dialing") {
      // Simular que la llamada se conecta después de 2 segundos
      const timeout = setTimeout(() => {
        setCallStatus("connected");
        
        // Iniciar temporizador para la duración de la llamada
        const interval = setInterval(() => {
          setCallTime(prev => prev + 1);
        }, 1000);
        
        setIntervalId(interval);
      }, 2000);
      
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  useEffect(() => {
    // Limpieza al desmontar el componente
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  const handleEndCall = () => {
    setCallStatus("ended");
    if (intervalId) {
      clearInterval(intervalId);
    }
    
    // Cerrar modal después de un segundo
    setTimeout(() => {
      onClose();
      // Resetear estados para la próxima llamada
      setCallStatus("dialing");
      setCallTime(0);
      setIsMuted(false);
    }, 1000);
  };

  const formatCallTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Permitir llamar al número real si se desea
  const initiateRealCall = () => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-sm rounded-xl shadow-2xl overflow-hidden p-6">
        <div className="flex flex-col items-center">
          {/* Avatar y estado */}
          <div className="w-20 h-20 rounded-full bg-[#0033A0] flex items-center justify-center mb-4 text-white text-3xl">
            <i className="fa-solid fa-headset"></i>
          </div>
          
          <h3 className="text-xl font-medium text-gray-800">Asistente de Viajes</h3>
          
          {callStatus === "dialing" && (
            <p className="text-gray-500 mt-2 flex items-center">
              <i className="fa-solid fa-phone-volume animate-pulse mr-2 text-[#0033A0]"></i>
              Llamando...
            </p>
          )}
          
          {callStatus === "connected" && (
            <p className="text-[#75B000] mt-2 font-medium flex items-center">
              <span className="inline-block w-2 h-2 rounded-full bg-[#75B000] mr-1.5 animate-pulse"></span>
              Conectado • {formatCallTime(callTime)}
            </p>
          )}
          
          {callStatus === "ended" && (
            <p className="text-gray-500 mt-2 flex items-center">
              <i className="fa-solid fa-phone-slash mr-2 text-red-500"></i>
              Llamada finalizada
            </p>
          )}
          
          {/* Número de teléfono formateado */}
          <p className="text-gray-400 text-sm mt-2 mb-6 flex items-center">
            <i className="fa-solid fa-phone mr-2"></i>
            {phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '+$1 $2 $3')}
          </p>
          
          {/* Botones de acción */}
          <div className="flex gap-8 mt-4 justify-center">
            {callStatus !== "ended" && (
              <>
                <button
                  className="w-16 h-16 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                  onClick={handleEndCall}
                  title="Finalizar llamada"
                  aria-label="Finalizar llamada"
                >
                  <i className="fa-solid fa-phone-slash text-3xl"></i>
                </button>
                
                <button
                  className="w-16 h-16 rounded-full bg-green-500 text-white flex items-center justify-center hover:bg-green-600 transition-colors shadow-lg"
                  onClick={() => initiateRealCall()}
                  title="Llamar al número real"
                  aria-label="Llamar al número real"
                >
                  <i className="fa-solid fa-phone text-3xl"></i>
                </button>
                
                <button
                  className={`w-16 h-16 rounded-full ${isMuted ? 'bg-gray-500' : 'bg-blue-500'} text-white flex items-center justify-center hover:${isMuted ? 'bg-gray-600' : 'bg-blue-600'} transition-colors shadow-lg`}
                  onClick={toggleMute}
                  title={isMuted ? "Activar micrófono" : "Silenciar micrófono"}
                  aria-label={isMuted ? "Activar micrófono" : "Silenciar micrófono"}
                >
                  <i className={`fa-solid ${isMuted ? 'fa-microphone-slash' : 'fa-microphone'} text-3xl`}></i>
                </button>
              </>
            )}
            
            {callStatus === "ended" && (
              <button
                className="px-6 py-3 bg-[#0033A0] text-white rounded-lg hover:bg-[#002169] transition-colors flex items-center gap-2"
                onClick={onClose}
              >
                <i className="fa-solid fa-xmark"></i>
                Cerrar
              </button>
            )}
          </div>
          
          <div className="mt-8 text-center text-xs text-gray-400">
            <p>También puedes contactarnos al:</p>
            <p className="mt-1 font-medium flex items-center justify-center gap-1">
              <i className="fa-solid fa-envelope text-[#0033A0]"></i>
              serviciocliente@nullpointers.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallModal; 