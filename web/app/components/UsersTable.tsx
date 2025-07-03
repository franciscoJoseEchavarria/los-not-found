import "~/styles/users.css";
import { useState } from "react";
import ContactModal from "./ContactModal";

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

interface UsersTableProps {
  usuariosData: User[];
  preferenciasUsuario: { [email: string]: Destination[] };
  visibilidadPreferencias: { [email: string]: boolean };
  loadPreferenciasUsuario: (email: string) => void;
  cargando: { [email: string]: boolean };
}

export default function UsersTable({
  usuariosData,
  preferenciasUsuario,
  visibilidadPreferencias,
  loadPreferenciasUsuario,
  cargando,
}: UsersTableProps) {
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  if (!usuariosData || usuariosData.length === 0) {
    return <div>No users found.</div>;
  }

  const openContactModal = (usuario: User) => {
    setSelectedUser(usuario);
    setContactModalOpen(true);
  };

  const closeContactModal = () => {
    setContactModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <>
      <div className="table-container">
        <table className="table">
          <thead className="table-header">
            <tr>
              <th className="w-1/5">Nombre</th>
              <th className="w-1/5">Email</th>
              <th className="w-2/5">Destinos Recomendados</th>
              <th className="w-1/5">Contacto</th>
            </tr>
          </thead>
          <tbody>
            {usuariosData.map((usuario) => (
              <tr key={usuario.email}>
                <td className="table-cell w-1/5">{usuario.nombre}</td>
                <td className="table-cell w-1/5">{usuario.email}</td>
                <td className="table-cell w-2/5">
                  {!visibilidadPreferencias[usuario.email] ? (
                    <button
                      onClick={() => loadPreferenciasUsuario(usuario.email)}
                      className="button button-view"
                      disabled={cargando[usuario.email]}
                    >
                      {cargando[usuario.email] ? "Cargando..." : "Ver Destinos"}
                    </button>
                  ) : (
                    <div className="destinations-container">
                      <button
                        onClick={() => loadPreferenciasUsuario(usuario.email)}
                        className="button button-hide"
                      >
                        Ocultar Destinos
                      </button>
                      <ul className="destinations-list">
                        {preferenciasUsuario[usuario.email]?.map(
                          (destino, index) => (
                            <li key={index} className="destination-item">
                              {destino.nombre}{" "}
                              {destino.nombre_continente
                                ? `(${destino.nombre_continente})`
                                : ""}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                </td>
                <td className="table-cell w-1/5">
                  <button
                    onClick={() => openContactModal(usuario)}
                    className="button button-contact"
                  >
                    Contactar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de contacto como componente separado */}
      <ContactModal 
        isOpen={contactModalOpen}
        onClose={closeContactModal}
        user={selectedUser}
      />
    </>
  );
}
