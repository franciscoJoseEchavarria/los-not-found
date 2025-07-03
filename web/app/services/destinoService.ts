// Propósito: Servicio de destino
// Notas: Este servicio se encarga de almacenar la información del destino seleccionado por el usuario

export interface Destino {                       //Objeto de tipo Destino
    id: number;
    nombre: string;
    descripcion: string;
    // Otros campos necesarios
}

export interface DestinoService {                 //Objeto de tipo DestinoService
    indice: number;
    nombreS: string;
    correoS: string;
    avatar: string;
    srcA: string;
    srcE: string;
    destinoA: string;
    destinoE: string;
    respuestasSer: string[];
    getDestinos: () => Promise<Destino[]>; 
    //Devuelve una promesa de array de objetos de tipo Destino
    // Otros métodos necesarios
  }
  
  
  export const destinoService: DestinoService = {
    indice: 0,
    nombreS: "Usuario",
    correoS: "usuario@example.com",
    avatar: "path/to/avatar.jpg",
    srcA: "path/to/srcA.jpg",
    srcE: "path/to/srcE.jpg",
    respuestasSer: [],
    destinoA: "defaultA",
    destinoE: "defaultE",
    getDestinos: async () => {
      try {
        // Lógica para obtener destinos desde una Mock API
        const response = await fetch('https://jsonplaceholder.typicode.com/posts'); // Ejemplo de Mock API
        if (!response.ok) {
          throw new Error(`Error al obtener destinos: ${response.statusText}`);
        }
        const destinos = await response.json();
        return destinos.map((destino: { id: number; title: string; body: string }) => ({
          id: destino.id,
          nombre: destino.title,
          descripcion: destino.body,
        })); // Mapeo de datos para ajustarlos al formato esperado
      } catch (error) {
        console.error('Error al conectar con la API:', error);
        return [];
      } //Este GET sirve para obtener los destinos desde una Mock API
    },
    // Implementación de otros métodos necesarios
  };

