using Api.DataContext;

namespace Api.Seeders
{
    /// <summary>
    /// Interfaz base para todos los seeders del sistema
    /// </summary>
    public interface ISeeder
    {
        /// <summary>
        /// Ejecuta el seeder para poblar la base de datos
        /// </summary>
        /// <param name="context">Contexto de la base de datos</param>
        /// <returns>Task que representa la operación asíncrona</returns>
        Task SeedAsync(AmadeusContext context);
        
        /// <summary>
        /// Orden de ejecución del seeder (menor valor = mayor prioridad)
        /// </summary>
        int Order { get; }
    }
} 