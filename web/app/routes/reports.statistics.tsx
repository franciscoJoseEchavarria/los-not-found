import { useLoaderData, useNavigation } from "@remix-run/react";
import { loader } from "~/loaders/statisticsLoader";
import { UserWithPreferencesAndDestinations } from "~/interfaces/userWithPreferencesAndDestinations";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useMemo, useState, useEffect } from "react";

export { loader };

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#8dd1e1",
  "#a4de6c",
  "#d0ed57",
];

// Loading component to show when data is not ready
const LoadingView = () => (
  <div className="flex justify-center items-center h-96">
    <h2 className="text-2xl font-bold text-gray-700">
      Cargando estadísticas...
    </h2>
  </div>
);

// Content component for statistics data
const StatisticsContent = ({
  usersData,
}: {
  usersData: UserWithPreferencesAndDestinations[];
}) => {
  // Add state for sorting
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Function to handle column sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Helper function to normalize text for sorting (removes accents/diacritics)
  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD") // Normalize to decomposed form
      .replace(/[\u0300-\u036f]/g, ""); // Remove diacritics
  };

  // Sorted users data
  const sortedUsersData = useMemo(() => {
    if (!sortField) return usersData;
    
    return [...usersData].sort((a, b) => {
      let aValue, bValue;
      
      // Get values based on sort field
      switch (sortField) {
        case 'tipo':
          aValue = a.userType;
          bValue = b.userType;
          break;
        case 'nombre':
          // Normalize names to handle accented characters
          aValue = normalizeText(a.nombre);
          bValue = normalizeText(b.nombre);
          break;
        case 'email':
          aValue = a.email.toLowerCase();
          bValue = b.email.toLowerCase();
          break;
        case 'preferencias':
          aValue = a.preferencias.length;
          bValue = b.preferencias.length;
          break;
        case 'destinos':
          aValue = a.destinos.length;
          bValue = b.destinos.length;
          break;
        default:
          aValue = a[sortField as keyof UserWithPreferencesAndDestinations];
          bValue = b[sortField as keyof UserWithPreferencesAndDestinations];
      }
      
      // Compare values based on direction
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [usersData, sortField, sortDirection]);
  
  // Sort indicator component
  const SortIndicator = ({ field }: { field: string }) => {
    if (sortField !== field) return null;
    
    return (
      <span className="ml-1 text-gray-500">
        {sortDirection === 'asc' ? '▲' : '▼'}
      </span>
    );
  };

  // Datos para las tarjetas de resumen
  const totalUsers = usersData.length;
  const usersWithPreferences = usersData.filter(
    (user) => user.preferencias.length > 0
  ).length;
  const usersWithDestinations = usersData.filter(
    (user) => user.destinos.length > 0
  ).length;
  const adminUsers = usersData.filter(
    (user) => user.userType === "ADMIN"
  ).length;
  const clientUsers = usersData.filter(
    (user) => user.userType === "CLIENT"
  ).length;

  // Datos para el gráfico de tipos de usuario
  const userTypeData = [
    { name: "Administradores", value: adminUsers },
    { name: "Clientes", value: clientUsers },
  ];

  // Datos para el gráfico de entornos preferidos
  const environmentData = useMemo(() => {
    const environments: { [key: string]: number } = {};

    usersData.forEach((user) => {
      user.preferencias.forEach((pref) => {
        if (!environments[pref.entorno]) {
          environments[pref.entorno] = 0;
        }
        environments[pref.entorno]++;
      });
    });

    return Object.entries(environments).map(([name, value]) => ({
      name,
      value,
    }));
  }, [usersData]);

  // Datos para el gráfico de climas preferidos
  const climateData = useMemo(() => {
    const climates: { [key: string]: number } = {};

    usersData.forEach((user) => {
      user.preferencias.forEach((pref) => {
        if (!climates[pref.clima]) {
          climates[pref.clima] = 0;
        }
        climates[pref.clima]++;
      });
    });

    return Object.entries(climates).map(([name, value]) => ({ name, value }));
  }, [usersData]);

  // Datos para el gráfico de actividades preferidas
  const activityData = useMemo(() => {
    const activities: { [key: string]: number } = {};

    usersData.forEach((user) => {
      user.preferencias.forEach((pref) => {
        if (!activities[pref.actividad]) {
          activities[pref.actividad] = 0;
        }
        activities[pref.actividad]++;
      });
    });

    return Object.entries(activities).map(([name, value]) => ({ name, value }));
  }, [usersData]);

  // Datos para el gráfico de alojamientos preferidos
  const accommodationData = useMemo(() => {
    const accommodations: { [key: string]: number } = {};

    usersData.forEach((user) => {
      user.preferencias.forEach((pref) => {
        if (!accommodations[pref.alojamiento]) {
          accommodations[pref.alojamiento] = 0;
        }
        accommodations[pref.alojamiento]++;
      });
    });

    return Object.entries(accommodations).map(([name, value]) => ({
      name,
      value,
    }));
  }, [usersData]);

  // Datos para el gráfico de tiempo de viaje preferido
  const travelTimeData = useMemo(() => {
    const travelTimes: { [key: string]: number } = {};

    usersData.forEach((user) => {
      user.preferencias.forEach((pref) => {
        if (!travelTimes[pref.tiempoViaje]) {
          travelTimes[pref.tiempoViaje] = 0;
        }
        travelTimes[pref.tiempoViaje]++;
      });
    });

    return Object.entries(travelTimes).map(([name, value]) => ({
      name,
      value,
    }));
  }, [usersData]);

  // Datos para el gráfico de rangos de edad preferidos
  const ageRangeData = useMemo(() => {
    const ageRanges: { [key: string]: number } = {};

    usersData.forEach((user) => {
      user.preferencias.forEach((pref) => {
        if (!ageRanges[pref.rangoEdad]) {
          ageRanges[pref.rangoEdad] = 0;
        }
        ageRanges[pref.rangoEdad]++;
      });
    });

    return Object.entries(ageRanges).map(([name, value]) => ({ name, value }));
  }, [usersData]);

  // Datos para el gráfico de continentes más visitados
  const continentData = useMemo(() => {
    const continents: { [key: string]: number } = {};

    usersData.forEach((user) => {
      user.destinos.forEach((dest) => {
        let continentName;
        switch (dest.continentesId) {
          case 1:
            continentName = "Asia";
            break;
          case 2:
            continentName = "América";
            break;
          case 3:
            continentName = "Europa";
            break;
          default:
            continentName = "Desconocido";
        }

        if (!continents[continentName]) {
          continents[continentName] = 0;
        }
        continents[continentName]++;
      });
    });

    return Object.entries(continents).map(([name, value]) => ({ name, value }));
  }, [usersData]);

  // Datos para el gráfico de países más visitados
  const countryData = useMemo(() => {
    const countries: { [key: string]: number } = {};

    usersData.forEach((user) => {
      user.destinos.forEach((dest) => {
        if (!countries[dest.pais]) {
          countries[dest.pais] = 0;
        }
        countries[dest.pais]++;
      });
    });

    return Object.entries(countries)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10); // Top 10 países
  }, [usersData]);

  const formatName = (name: string) => {
    return name
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-gray-700 border-b-2 border-gray-200 pb-2">
        Estadísticas de Usuarios, Preferencias y Destinos
      </h1>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow flex flex-col h-full">
          <h3 className="text-xl font-medium mb-2 text-gray-600">
            Total de Usuarios
          </h3>
          <div className="text-3xl font-bold text-blue-500 mb-2">
            {totalUsers}
          </div>
          <p className="text-sm text-gray-500 flex-grow">
            Número total de usuarios registrados en el sistema
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow flex flex-col h-full">
          <h3 className="text-xl font-medium mb-2 text-gray-600">
            Usuarios con Preferencias
          </h3>
          <div className="text-3xl font-bold text-blue-500 mb-2">
            {usersWithPreferences}
          </div>
          <p className="text-sm text-gray-500 flex-grow">
            Usuarios que han definido sus preferencias de viaje (
            {Math.round((usersWithPreferences / totalUsers) * 100)}%)
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow flex flex-col h-full">
          <h3 className="text-xl font-medium mb-2 text-gray-600">
            Usuarios con Destinos
          </h3>
          <div className="text-3xl font-bold text-blue-500 mb-2">
            {usersWithDestinations}
          </div>
          <p className="text-sm text-gray-500 flex-grow">
            Usuarios que tienen destinos asociados (
            {Math.round((usersWithDestinations / totalUsers) * 100)}%)
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow flex flex-col h-full">
          <h3 className="text-xl font-medium mb-2 text-gray-600">
            Tipos de Usuario
          </h3>
          <div className="text-3xl font-bold text-blue-500 mb-2">
            {adminUsers} / {clientUsers}
          </div>
          <p className="text-sm text-gray-500 flex-grow">
            Relación entre administradores y clientes
          </p>
        </div>
      </div>

      {/* Sección de gráficas */}
      <div className="bg-gray-50 p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-bold mb-4 text-gray-700 border-b-2 border-gray-200 pb-2">
          Distribución de Usuarios
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow min-h-[400px] flex flex-col">
            <h3 className="text-lg font-medium mb-4 text-gray-600 text-center">
              Tipos de Usuario
            </h3>
            <ResponsiveContainer width="100%" height={380}>
              <PieChart margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                <Pie
                  data={userTypeData}
                  cx="50%"
                  cy="45%"
                  labelLine={true}
                  outerRadius={85}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name: entryName, percent }) =>
                    `${entryName}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {userTypeData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, "Cantidad"]} />
                <Legend wrapperStyle={{ paddingTop: 30 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-bold mb-4 text-gray-700 border-b-2 border-gray-200 pb-2">
          Preferencias de Viaje
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow min-h-[400px] flex flex-col">
            <h3 className="text-lg font-medium mb-4 text-gray-600 text-center">
              Entornos Preferidos
            </h3>
            <ResponsiveContainer width="100%" height={380}>
              <PieChart margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                <Pie
                  data={environmentData}
                  cx="50%"
                  cy="45%"
                  labelLine={true}
                  outerRadius={85}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {environmentData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [
                    value,
                    formatName(name.toString()),
                  ]}
                />
                <Legend
                  formatter={(value) => formatName(value)}
                  wrapperStyle={{ paddingTop: 30 }}
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-lg shadow min-h-[400px] flex flex-col">
            <h3 className="text-lg font-medium mb-4 text-gray-600 text-center">
              Climas Preferidos
            </h3>
            <ResponsiveContainer width="100%" height={380}>
              <PieChart margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                <Pie
                  data={climateData}
                  cx="50%"
                  cy="45%"
                  labelLine={true}
                  outerRadius={85}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {climateData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [
                    value,
                    formatName(name.toString()),
                  ]}
                />
                <Legend
                  formatter={(value) => formatName(value)}
                  wrapperStyle={{ paddingTop: 30 }}
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-lg shadow min-h-[400px] flex flex-col">
            <h3 className="text-lg font-medium mb-4 text-gray-600 text-center">
              Actividades Preferidas
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={activityData}
                margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={70}
                  tick={{ fontSize: 12 }}
                  tickFormatter={formatName}
                />
                <YAxis />
                <Tooltip
                  formatter={(value) => [value, "Cantidad"]}
                  labelFormatter={formatName}
                />
                <Bar dataKey="value" fill="#8884d8" name="Cantidad" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-lg shadow min-h-[400px] flex flex-col">
            <h3 className="text-lg font-medium mb-4 text-gray-600 text-center">
              Alojamientos Preferidos
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={accommodationData}
                margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={70}
                  tick={{ fontSize: 12 }}
                  tickFormatter={formatName}
                />
                <YAxis />
                <Tooltip
                  formatter={(value) => [value, "Cantidad"]}
                  labelFormatter={formatName}
                />
                <Bar dataKey="value" fill="#82ca9d" name="Cantidad" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-lg shadow min-h-[400px] flex flex-col">
            <h3 className="text-lg font-medium mb-4 text-gray-600 text-center">
              Tiempo de Viaje Preferido
            </h3>
            <ResponsiveContainer width="100%" height={380}>
              <PieChart margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                <Pie
                  data={travelTimeData}
                  cx="50%"
                  cy="45%"
                  labelLine={true}
                  outerRadius={85}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {travelTimeData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [
                    value,
                    formatName(name.toString()),
                  ]}
                />
                <Legend
                  formatter={(value) => formatName(value)}
                  wrapperStyle={{ paddingTop: 30 }}
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-lg shadow min-h-[400px] flex flex-col">
            <h3 className="text-lg font-medium mb-4 text-gray-600 text-center">
              Rangos de Edad Preferidos
            </h3>
            <ResponsiveContainer width="100%" height={380}>
              <PieChart margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                <Pie
                  data={ageRangeData}
                  cx="50%"
                  cy="45%"
                  labelLine={true}
                  outerRadius={85}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {ageRangeData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [
                    value,
                    formatName(name.toString()),
                  ]}
                />
                <Legend
                  formatter={(value) => formatName(value)}
                  wrapperStyle={{ paddingTop: 30 }}
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-bold mb-4 text-gray-700 border-b-2 border-gray-200 pb-2">
          Destinos y Continentes
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow min-h-[400px] flex flex-col">
            <h3 className="text-lg font-medium mb-4 text-gray-600 text-center">
              Continentes más Visitados
            </h3>
            <ResponsiveContainer width="100%" height={380}>
              <PieChart margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                <Pie
                  data={continentData}
                  cx="50%"
                  cy="45%"
                  labelLine={true}
                  outerRadius={85}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {continentData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, "Cantidad"]} />
                <Legend
                  wrapperStyle={{ paddingTop: 30 }}
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-lg shadow min-h-[400px] flex flex-col">
            <h3 className="text-lg font-medium mb-4 text-gray-600 text-center">
              Top 10 Países más Visitados
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={countryData}
                margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={120}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip formatter={(value) => [value, "Cantidad"]} />
                <Bar dataKey="value" fill="#ffc658" name="Cantidad" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-bold mb-4 text-gray-700 border-b-2 border-gray-200 pb-2">
          Detalle de Usuarios
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse mt-4 bg-white shadow-sm rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th 
                  className="p-3 font-semibold text-sm text-gray-700 border-b cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSort('nombre')}
                >
                  Nombre <SortIndicator field="nombre" />
                </th>
                <th 
                  className="p-3 font-semibold text-sm text-gray-700 border-b cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSort('email')}
                >
                  Email <SortIndicator field="email" />
                </th>
                <th 
                  className="p-3 font-semibold text-sm text-gray-700 border-b cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSort('tipo')}
                >
                  Tipo <SortIndicator field="tipo" />
                </th>
                <th 
                  className="p-3 font-semibold text-sm text-gray-700 border-b cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSort('preferencias')}
                >
                  # Preferencias <SortIndicator field="preferencias" />
                </th>
                <th 
                  className="p-3 font-semibold text-sm text-gray-700 border-b cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSort('destinos')}
                >
                  # Destinos <SortIndicator field="destinos" />
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedUsersData.map((user) => (
                <tr 
                  key={user.id} 
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="p-3 text-sm font-medium">{user.nombre}</td>
                  <td className="p-3 text-sm text-blue-600">{user.email}</td>
                  <td className="p-3 text-sm">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      user.userType === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {user.userType}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-center">
                    <span className="font-medium">
                      {user.preferencias.length}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-center">
                    <span className="font-medium">
                      {user.destinos.length}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Main component that handles loading state
export default function Statistics() {
  // Get navigation state and data
  const navigation = useNavigation();
  const usersData = useLoaderData<
    typeof loader
  >() as UserWithPreferencesAndDestinations[];

  // Set initial loading state
  const [isLoading, setIsLoading] = useState(true);

  // Update loading state when data is available
  useEffect(() => {
    if (usersData && usersData.length > 0) {
      setIsLoading(false);
    }
  }, [usersData]);

  // Check if we're navigating TO the statistics page
  // Only show loading when we're navigating to this route, not away from it
  const isNavigatingToStatistics =
    navigation.state === "loading" &&
    navigation.location?.pathname.includes("/reports/statistics");

  // Show loading view when we're either in initial loading state
  // or specifically navigating TO the statistics page
  if (isLoading || isNavigatingToStatistics) {
    return <LoadingView />;
  }

  // We have data and loading is complete
  return <StatisticsContent usersData={usersData} />;
}
