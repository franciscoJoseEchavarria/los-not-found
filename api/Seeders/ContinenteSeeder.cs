using Api.DataContext;
using Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Api.Seeders
{
    /// <summary>
    /// Seeder para poblar la tabla de Continentes
    /// </summary>
    public class ContinenteSeeder : ISeeder
    {
        public int Order => 1; // Ejecutar primero por dependencias

        public async Task SeedAsync(AmadeusContext context)
        {
            // Verificar si ya hay datos
            if (await context.Continentes.AnyAsync())
            {
                Console.WriteLine("⚠️  Los continentes ya están poblados. Saltando seeder...");
                return;
            }

            Console.WriteLine("🌍 Poblando tabla de Continentes...");

            var continentes = new List<Continente>
            {
                new Continente
                {
                    Nombre = "Asia",
                    Descripcion = "Continente Asiatico, por defecto"
                },
                new Continente
                {
                    Nombre = "America",
                    Descripcion = "Continente Americano"
                },
                new Continente
                {
                    Nombre = "Europa",
                    Descripcion = "Continente Europeo"
                }
            };

            await context.Continentes.AddRangeAsync(continentes);
            await context.SaveChangesAsync();
            
            Console.WriteLine($"✅ Se insertaron {continentes.Count} continentes correctamente");
        }
    }
} 