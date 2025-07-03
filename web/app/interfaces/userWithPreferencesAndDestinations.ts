export interface Preferencia {
  id: number;
  entorno: string;
  clima: string;
  actividad: string;
  alojamiento: string;
  tiempoViaje: string;
  rangoEdad: string;
}

export interface Destino {
  id: number;
  comidaTipica: string;
  createdAt: string;
  idioma: string;
  imgUrl: string;
  lugarImperdible: string;
  nombre: string;
  pais: string;
  continentesId: number;
  continentes: any;
}

export interface UserWithPreferencesAndDestinations {
  id: number;
  email: string;
  nombre: string;
  userType: string;
  preferencias: Preferencia[];
  destinos: Destino[];
} 