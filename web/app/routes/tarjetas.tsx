import type { LoaderFunction } from "@remix-run/node";
import { json} from "@remix-run/react";
import useDestinoService from "~/hooks/useTarjetasLogic";
import { useAuth } from "~/hooks/useAuth";

export const loader: LoaderFunction = async () => {
  return json({ Tarjetas: "Tarjetas" });
};

export default function Tarjetas() {
  const { authorized } = useAuth(["CLIENT", "ADMIN"]);

  const {
    indice,
    setIndice,
    respuestasSer,
    opcSelect,
    setOpcSelect,
    disSig,
    disAtras,
    hidSig,
    calcular,
    PreferenciasLabels,
    preguntas,
    opciones,
    imagenes,
    datos,
    verificarSeleccion,
    regresarPerfil,
    atras,
    siguiente,
    contadores,
    navigate,
  } = useDestinoService();

  if (!authorized) {
    navigate("login");
  }

  return (
    <main className="flex flex-col items-center justify-center h-[94vh] overflow-y-auto py-6 px-4 sm:px-6 lg:px-8 text-white bg-[#0e1720] bg-blend-overlay bg-opacity-90 bg-[url('https://images.unsplash.com/photo-1542224566-6e85f2e6772f?q=80&w=1600')] bg-cover bg-fixed">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-light tracking-wide animate-[fadeIn_0.8s_ease-in-out]">
          {preguntas[indice]}
        </h1>
        <div className="w-24 h-1 bg-[#3a8bff] mx-auto mt-4"></div>
      </div>

      <div className="flex flex-wrap justify-center gap-6 mb-10">
        {opciones[indice].map((opcion, index) => (
          <label
            key={index}
            htmlFor={`opc${index + 1}`}
            className="cursor-pointer w-80 max-w-full"
            aria-label={opcion}
          >
            <div className="relative transform transition duration-300 hover:-translate-y-2 group">
              <div className="bg-white text-gray-800 rounded-xl shadow-lg overflow-hidden">
                <img
                  src={imagenes[indice][index]}
                  alt={`imagen_${opcion}`}
                  className="w-full h-52 object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="p-5 text-center">
                  <h3 className="text-lg font-medium">{opcion}</h3>
                </div>
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#000835] bg-opacity-90 text-white opacity-0 group-hover:opacity-100 transition duration-300 p-5 rounded-xl">
                <h3 className="text-xl font-semibold mb-2 text-[#c5d5f9]">¿Sabías qué...</h3>
                <p className="text-sm">{datos[indice][index]}</p>
              </div>
            </div>
            <div className="flex justify-center mt-3">
              <input
                id={`opc${index + 1}`}
                type="radio"
                value={opcion}
                name="opciones"
                className="appearance-none w-6 h-6 rounded-full border-2 border-[#3a8bff] bg-transparent cursor-pointer checked:bg-[#3a8bff] relative"
                checked={opcSelect === opcion}
                onChange={() => {
                  setOpcSelect(opcion);
                  verificarSeleccion(opcion);
                }}
              />
            </div>
          </label>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <button
          className="px-6 py-2.5 bg-[#011e41] text-white rounded-lg shadow-md hover:bg-[#000835] transition"
          onClick={() => {
            const destinoService = {
              indice,
              setIndice,
              respuestasSer: respuestasSer,
              PreferenciasLabels,
            };
            regresarPerfil(destinoService);
          }}
        >
          <span className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            Perfil
          </span>
        </button>

        {contadores.map((contador, idx) => (
          <button
            key={idx}
            className={`w-10 h-10 flex items-center justify-center rounded-full transition ${
              idx === indice
                ? "bg-[#0c66e1] text-white"
                : "bg-[#c5d5f9] text-[#000835] hover:bg-[#a9bff0]"
            }`}
            onClick={() => {
              setIndice(idx);
              setOpcSelect("");
            }}
          >
            {idx + 1}
          </button>
        ))}
      </div>

      <div className="flex justify-center gap-8 mt-2">
        <button
          className={`px-6 py-2.5 ${!disAtras ? 'bg-[#0c66e1] hover:bg-[#3a8bff]' : 'bg-[#011e41] hover:bg-[#000835]'} text-white rounded-lg shadow-md transition disabled:opacity-50`}
          type="button"
          onClick={atras}
          disabled={disAtras}
        >
          <span className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Atrás
          </span>
        </button>
        
        {!hidSig && (
          <button
            className="px-6 py-2.5 bg-[#0c66e1] text-white rounded-lg shadow-md hover:bg-[#3a8bff] transition disabled:opacity-50"
            type="button"
            onClick={siguiente}
            disabled={disSig}
          >
            <span className="flex items-center gap-2">
              Siguiente
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </span>
          </button>
        )}
        
        {!calcular && (
          <button
            className="px-6 py-2.5 bg-[#3a8bff] text-white rounded-lg shadow-md hover:bg-[#0c66e1] transition"
            type="button"
            onClick={(e) => {
              e.preventDefault();
              if (respuestasSer.length === 0) {
                console.error("El array de respuestas está vacío.");
                return;
              }
              sessionStorage.setItem("respuestas", JSON.stringify(respuestasSer));
              navigate("/resultados");
            }}
          >
            <span className="flex items-center gap-2">
              Calcular Destino
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </span>
          </button>
        )}
      </div>
    </main>
  );
}
