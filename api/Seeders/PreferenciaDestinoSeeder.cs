using Api.DataContext;
using Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Api.Seeders
{
    public class PreferenciaDestinoSeeder : ISeeder
    {
        public int Order => 4; // Después de Preferencias

        public async Task SeedAsync(AmadeusContext context)
        {
            if (await context.Set<DestinosPreferencia>().AnyAsync())
            {
                Console.WriteLine("⚠️  Las asociaciones destino-preferencia ya están pobladas. Saltando seeder...");
                return;
            }

            Console.WriteLine("🔗 Poblando tabla de Destinos-Preferencias...");

            // Obtener todos los destinos y preferencias en el orden de inserción
            var destinos = await context.Destinos.OrderBy(d => d.Id).ToListAsync();
            var preferencias = await context.Preferencias.OrderBy(p => p.Id).ToListAsync();

            // Asociaciones según el orden proporcionado (pares 1-1, 2-1, 3-2, ...)
            var asociaciones = new List<(int destino, int preferencia)>
            {
                (1,1),(2,1),(3,2),(4,2),(5,3),(6,3),(7,4),(8,4),(9,5),(10,5),
                (11,6),(12,6),(13,7),(14,7),(15,8),(16,8),(17,9),(18,9),(19,10),(20,10),
                (21,11),(22,11),(23,12),(24,12),(25,13),(26,13),(27,14),(28,14),(29,15),(30,15),
                (31,16),(32,16),(33,17),(34,17),(35,18),(36,18),(37,19),(38,19)
            };

            var destinoPreferencias = new List<DestinosPreferencia>();
            foreach (var (destinoIdx, preferenciaIdx) in asociaciones)
            {
                if (destinoIdx <= destinos.Count && preferenciaIdx <= preferencias.Count)
                {
                    destinoPreferencias.Add(new DestinosPreferencia
                    {
                        DestinosId = destinos[destinoIdx - 1].Id,
                        PreferenciasId = preferencias[preferenciaIdx - 1].Id
                    });
                }
            }

            await context.Set<DestinosPreferencia>().AddRangeAsync(destinoPreferencias);
            await context.SaveChangesAsync();
            Console.WriteLine($"✅ Se insertaron {destinoPreferencias.Count} asociaciones destino-preferencia correctamente");
        }
    }
}
