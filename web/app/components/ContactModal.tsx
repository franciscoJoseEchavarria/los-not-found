import { Dialog } from "@headlessui/react";
import { useContactModal, User } from "../hooks/useContactModal";
import { useState, useEffect } from "react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export default function ContactModal({
  isOpen,
  onClose,
  user,
}: ContactModalProps) {
  const [recipientEmail, setRecipientEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  
  useEffect(() => {
    if (user && user.email) {
      setRecipientEmail(user.email);
    }
  }, [user]);

  const {
    emailSubject,
    setEmailSubject,
    emailContent,
    setEmailContent,
    emailHtmlContent,
    destinosDelUsuario,
    isLoading,
    previewMode,
    setPreviewMode,
    handleSendEmail,
  } = useContactModal(isOpen, user);

  const handleSendAndClose = async () => {
    if (isSending) return;
    
    setIsSending(true);
    try {
      const success = await handleSendEmail(recipientEmail);
      if (success) {
        onClose();
      }
    } catch (error) {
      console.error("Error al preparar email:", error);
    } finally {
      setIsSending(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-3xl rounded-lg bg-white p-6 shadow-xl">
          <Dialog.Title className="text-2xl font-semibold text-gray-900 mb-4">
            Enviar promoción a {user.nombre}
          </Dialog.Title>

          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <span className="ml-3">Cargando destinos...</span>
            </div>
          ) : (
            <>
              {/* Membrete con imágenes */}
              <div className="email-header mb-6">
                <div className="email-letterhead flex justify-between items-center border-b border-gray-200 pb-4">
                  <div className="logo-container border border-gray-200 p-2 rounded flex items-center justify-center" style={{ minWidth: "150px" }}>
                    <img
                      className="h-12 w-auto transition-transform duration-300"
                      src="/imagenes/amadeus-logo-dark-sky.png?v=1"
                      alt="Amadeus Logo"
                      width="120"
                    />
                  </div>

                  <div className="letterhead-images flex space-x-2">
                    {destinosDelUsuario.length > 0 ? (
                      // Mostrar los destinos del usuario con imágenes reales
                      destinosDelUsuario.slice(0, 3).map((destino, index) => (
                        <div
                          key={index}
                          className="relative h-20 w-28 rounded-md overflow-hidden"
                        >
                          <img
                            src={
                              destino.imgUrl ||
                              `https://placehold.co/112x80?text=${destino.nombre}`
                            }
                            alt={destino.nombre}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.onerror = null;
                              target.src = `https://placehold.co/112x80?text=${destino.nombre}`;
                            }}
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 text-center">
                            {destino.nombre}
                          </div>
                        </div>
                      ))
                    ) : (
                      // Mostrar destinos genéricos si no hay preferencias
                      <>
                        <div className="relative h-20 w-28 rounded-md overflow-hidden">
                          <img
                            src="https://placehold.co/112x80?text=Destinos"
                            alt="Destinos"
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 text-center">
                            Destinos
                          </div>
                        </div>
                        <div className="relative h-20 w-28 rounded-md overflow-hidden">
                          <img
                            src="https://placehold.co/112x80?text=Especiales"
                            alt="Ofertas"
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 text-center">
                            Ofertas
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="recipient-email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Destinatario
                </label>
                <input
                  type="text"
                  id="recipient-email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  aria-label="Email del destinatario"
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="email-subject"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Asunto
                </label>
                <input
                  type="text"
                  id="email-subject"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  aria-label="Asunto del email"
                />
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-1">
                  <label
                    htmlFor="email-content"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Contenido
                  </label>
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => setPreviewMode(false)}
                      className={`px-3 py-1 text-xs rounded-l-md ${
                        !previewMode
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewMode(true)}
                      className={`px-3 py-1 text-xs rounded-r-md ${
                        previewMode
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      Vista previa
                    </button>
                  </div>
                </div>

                {previewMode ? (
                  <div
                    className="w-full p-4 border border-gray-300 rounded-md bg-white h-[400px] overflow-auto"
                    dangerouslySetInnerHTML={{ __html: emailHtmlContent }}
                  />
                ) : (
                  <textarea
                    id="email-content"
                    value={emailContent}
                    onChange={(e) => setEmailContent(e.target.value)}
                    rows={15}
                    className="w-full p-2 border border-gray-300 rounded-md font-sans text-sm"
                    aria-label="Contenido del email"
                  />
                )}
                <p className="mt-1 text-xs text-gray-500">
                  {previewMode
                    ? "Visualizando la versión HTML que se enviará por correo"
                    : "Editando la versión de texto plano (la versión HTML se generará automáticamente)"}
                </p>
              </div>
            </>
          )}

          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              disabled={isSending}
            >
              Cancelar
            </button>
            <button
              onClick={handleSendAndClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px]"
              disabled={isLoading || isSending}
            >
              {isSending ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Preparando...
                </>
              ) : "Enviar"}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
