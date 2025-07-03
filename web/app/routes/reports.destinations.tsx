import { useLoaderData } from "@remix-run/react";
import { loader } from "~/loaders/destinationsLoader";
import { Destination } from "~/interfaces/destination";
import "~/styles/reportDestination.css";

export { loader };

export default function Destinations() {
  const destinationData = useLoaderData<typeof loader>();

  return (
    <div className="destinations-container">
      {destinationData.length > 0 ? (
        <div className="destinations-grid">
          {destinationData.map((destination: Destination) => (
            <div key={destination.id} className="destination-card">
              <img
                className="destination-image"
                src={destination.imgUrl}
                alt={destination.nombre}
              />
              <div className="destination-content">
                <div className="destination-title">{destination.nombre}</div>
                <p className="destination-text">
                  <strong>País:</strong> {destination.pais}
                  <br />
                  <strong>Idioma:</strong> {destination.idioma}
                  <br />
                  <strong>Lugar Imperdible:</strong> {destination.lugar_imperdible}
                  <br />
                  <strong>Comida Típica:</strong> {destination.comida_tipica}
                  <br />
                  <strong>Continente:</strong> {destination.nombre_continente}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center">No hay destinos disponibles.</p>
      )}
    </div>
  );
}
