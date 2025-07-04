using Api.DataContext;
using Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Api.Seeders
{
    public class PreferenciaSeeder : ISeeder
    {
        public int Order => 3; // Después de Destinos

        public async Task SeedAsync(AmadeusContext context)
        {
            if (await context.Preferencias.AnyAsync())
            {
                Console.WriteLine("⚠️  Las preferencias ya están pobladas. Saltando seeder...");
                return;
            }

            Console.WriteLine("✨ Poblando tabla de Preferencias...");

            var preferencias = new List<Preferencia>
            {
                new Preferencia { Entorno = "PLAYA", Clima = "CALUROSO", Actividad = "RELAX_Y_BIENESTAR", Alojamiento = "HOTEL_LUJO", TiempoViaje = "UNA_Y_DOS_SEMANAS", RangoEdad = "MENOR_QUE_TREINTA" },
                new Preferencia { Entorno = "PLAYA", Clima = "CALUROSO", Actividad = "CULTURA_Y_MUSEOS", Alojamiento = "AIRBNB", TiempoViaje = "MENOR_UNA_SEMANA", RangoEdad = "MENOR_QUE_TREINTA" },
                new Preferencia { Entorno = "PLAYA", Clima = "TEMPLADO", Actividad = "CULTURA_Y_MUSEOS", Alojamiento = "HOTEL_LUJO", TiempoViaje = "UNA_Y_DOS_SEMANAS", RangoEdad = "TREINTA_Y_CINCUENTA" },
                new Preferencia { Entorno = "MONTANA", Clima = "FRIO", Actividad = "DEPORTES_Y_AVENTURAS", Alojamiento = "HOSTAL_ALBERGUE", TiempoViaje = "UNA_Y_DOS_SEMANAS", RangoEdad = "MENOR_QUE_TREINTA" },
                new Preferencia { Entorno = "MONTANA", Clima = "TEMPLADO", Actividad = "CULTURA_Y_MUSEOS", Alojamiento = "AIRBNB", TiempoViaje = "UNA_Y_DOS_SEMANAS", RangoEdad = "MAYOR_QUE_CINCUENTA" },
                new Preferencia { Entorno = "MONTANA", Clima = "FRIO", Actividad = "DEPORTES_Y_AVENTURAS", Alojamiento = "HOTEL_LUJO", TiempoViaje = "UNA_Y_DOS_SEMANAS", RangoEdad = "TREINTA_Y_CINCUENTA" },
                new Preferencia { Entorno = "CIUDAD", Clima = "TEMPLADO", Actividad = "CULTURA_Y_MUSEOS", Alojamiento = "HOTEL_LUJO", TiempoViaje = "UNA_Y_DOS_SEMANAS", RangoEdad = "MAYOR_QUE_CINCUENTA" },
                new Preferencia { Entorno = "CIUDAD", Clima = "TEMPLADO", Actividad = "RELAX_Y_BIENESTAR", Alojamiento = "AIRBNB", TiempoViaje = "MENOR_UNA_SEMANA", RangoEdad = "MENOR_QUE_TREINTA" },
                new Preferencia { Entorno = "CIUDAD", Clima = "FRIO", Actividad = "CULTURA_Y_MUSEOS", Alojamiento = "HOTEL_LUJO", TiempoViaje = "UNA_Y_DOS_SEMANAS", RangoEdad = "TREINTA_Y_CINCUENTA" },
                new Preferencia { Entorno = "PLAYA", Clima = "CALUROSO", Actividad = "DEPORTES_Y_AVENTURAS", Alojamiento = "HOSTAL_ALBERGUE", TiempoViaje = "UNA_Y_DOS_SEMANAS", RangoEdad = "MENOR_QUE_TREINTA" },
                new Preferencia { Entorno = "MONTANA", Clima = "FRIO", Actividad = "CULTURA_Y_MUSEOS", Alojamiento = "AIRBNB", TiempoViaje = "UNA_Y_DOS_SEMANAS", RangoEdad = "MAYOR_QUE_CINCUENTA" },
                new Preferencia { Entorno = "PLAYA", Clima = "TEMPLADO", Actividad = "RELAX_Y_BIENESTAR", Alojamiento = "AIRBNB", TiempoViaje = "MAYOR_DOS_SEMANAS", RangoEdad = "MAYOR_QUE_CINCUENTA" },
                new Preferencia { Entorno = "CIUDAD", Clima = "TEMPLADO", Actividad = "DEPORTES_Y_AVENTURAS", Alojamiento = "HOTEL_LUJO", TiempoViaje = "MENOR_UNA_SEMANA", RangoEdad = "TREINTA_Y_CINCUENTA" },
                new Preferencia { Entorno = "PLAYA", Clima = "TEMPLADO", Actividad = "CULTURA_Y_MUSEOS", Alojamiento = "HOSTAL_ALBERGUE", TiempoViaje = "UNA_Y_DOS_SEMANAS", RangoEdad = "MENOR_QUE_TREINTA" },
                new Preferencia { Entorno = "MONTANA", Clima = "TEMPLADO", Actividad = "DEPORTES_Y_AVENTURAS", Alojamiento = "AIRBNB", TiempoViaje = "MAYOR_DOS_SEMANAS", RangoEdad = "MENOR_QUE_TREINTA" },
                new Preferencia { Entorno = "CIUDAD", Clima = "CALUROSO", Actividad = "CULTURA_Y_MUSEOS", Alojamiento = "HOTEL_LUJO", TiempoViaje = "UNA_Y_DOS_SEMANAS", RangoEdad = "MAYOR_QUE_CINCUENTA" },
                new Preferencia { Entorno = "PLAYA", Clima = "CALUROSO", Actividad = "CULTURA_Y_MUSEOS", Alojamiento = "HOTEL_LUJO", TiempoViaje = "UNA_Y_DOS_SEMANAS", RangoEdad = "TREINTA_Y_CINCUENTA" },
                new Preferencia { Entorno = "MONTANA", Clima = "FRIO", Actividad = "RELAX_Y_BIENESTAR", Alojamiento = "AIRBNB", TiempoViaje = "UNA_Y_DOS_SEMANAS", RangoEdad = "MAYOR_QUE_CINCUENTA" },
                new Preferencia { Entorno = "CIUDAD", Clima = "TEMPLADO", Actividad = "CULTURA_Y_MUSEOS", Alojamiento = "HOSTAL_ALBERGUE", TiempoViaje = "UNA_Y_DOS_SEMANAS", RangoEdad = "TREINTA_Y_CINCUENTA" }
            };

            await context.Preferencias.AddRangeAsync(preferencias);
            await context.SaveChangesAsync();
            Console.WriteLine($"✅ Se insertaron {preferencias.Count} preferencias correctamente");
        }
    }
}
