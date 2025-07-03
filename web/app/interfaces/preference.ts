export interface DestinoResponse {
  nombre: string;
  nombre_continente: string;
}

export interface Preferencia {
  entorno: string;
  clima: string;
  actividad: string;
  alojamiento: string;
  tiempoViaje: string;
  rangoEdad: string;
  destinoResponseList: DestinoResponse[];
}
