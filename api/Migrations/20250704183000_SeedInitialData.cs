using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Api.Migrations
{
    /// <inheritdoc />
    public partial class SeedInitialData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Continentes
            migrationBuilder.InsertData("continentes", new[] { "id", "nombre", "descripcion" },
                new object[,]
                {
                    { 1L, "América", "Continente del oeste" },
                    { 2L, "Europa", "Continente del este" },
                    { 3L, "Asia", "Continente más poblado" },
                    { 4L, "África", "Cuna de la humanidad" },
                    { 5L, "Oceanía", "Islas del Pacífico" },
                    { 6L, "Antártida", "Continente helado" }
                });

            // Preferencias
            migrationBuilder.InsertData("preferencias", new[] { "id", "actividad", "alojamiento", "clima", "entorno", "rango_edad", "tiempo_viaje" },
                new object[,]
                {
                    { 1L, "Aventura", "Hostel", "Frío", "Montaña", "18-25", "Corto" },
                    { 2L, "Cultura", "Hotel", "Templado", "Ciudad", "26-35", "Medio" },
                    { 3L, "Relax", "Resort", "Cálido", "Playa", "30-50", "Largo" },
                    { 4L, "Exploración", "Campamento", "Ártico", "Desierto", "20-40", "Largo" },
                    { 5L, "Gastronomía", "Apartamento", "Templado", "Ciudad", "25-45", "Medio" }
                });

            // Usuarios
            migrationBuilder.InsertData("usuarios", new[] { "id", "nombre", "email", "password", "user_type", "created_at" },
                new object[,]
                {
                    { 1L, "Juan Pérez", "juan@example.com", "hashedpass1", "CLIENT", DateTime.UtcNow },
                    { 2L, "Ana López", "ana@example.com", "hashedpass2", "CLIENT", DateTime.UtcNow },
                    { 3L, "Carlos Rojas", "carlos@example.com", "hashedpass3", "CLIENT", DateTime.UtcNow },
                    { 4L, "Lucía Méndez", "lucia@example.com", "hashedpass4", "ADMIN", DateTime.UtcNow }
                });

            // Destinos
            migrationBuilder.InsertData("destinos", new[] { "id", "nombre", "pais", "comida_tipica", "lugar_imperdible", "idioma", "continentes_id" },
                new object[,]
                {
                    { 1L, "Cusco", "Perú", "Cuy chactado", "Machu Picchu", "Español", 1L },
                    { 2L, "París", "Francia", "Croissant", "Torre Eiffel", "Francés", 2L },
                    { 3L, "Tokio", "Japón", "Sushi", "Monte Fuji", "Japonés", 3L },
                    { 4L, "El Cairo", "Egipto", "Koshari", "Pirámides de Giza", "Árabe", 4L },
                    { 5L, "Sídney", "Australia", "Meat pie", "Opera House", "Inglés", 5L },
                    { 6L, "Estación McMurdo", "Antártida", "Comida enlatada", "Polo Sur", "Inglés", 6L }
                });

            // PreferenciaUsuario
            migrationBuilder.InsertData("preferencia_usuarios", new[] { "id", "usuarios_id", "preferencias_id", "created_at" },
                new object[,]
                {
                    { 1L, 1L, 1L, DateTime.UtcNow },
                    { 2L, 2L, 2L, DateTime.UtcNow },
                    { 3L, 3L, 3L, DateTime.UtcNow },
                    { 4L, 4L, 4L, DateTime.UtcNow }
                });

            // DestinosPreferencias
            migrationBuilder.InsertData("destinos_preferencias", new[] { "preferencias_id", "destinos_id" },
                new object[,]
                {
                    { 1L, 1L },
                    { 2L, 2L },
                    { 3L, 3L },
                    { 4L, 4L },
                    { 5L, 5L }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData("destinos_preferencias", "preferencias_id", 1L);
            migrationBuilder.DeleteData("destinos_preferencias", "preferencias_id", 2L);
            migrationBuilder.DeleteData("destinos_preferencias", "preferencias_id", 3L);
            migrationBuilder.DeleteData("destinos_preferencias", "preferencias_id", 4L);
            migrationBuilder.DeleteData("destinos_preferencias", "preferencias_id", 5L);

            migrationBuilder.DeleteData("preferencia_usuarios", "id", 1L);
            migrationBuilder.DeleteData("preferencia_usuarios", "id", 2L);
            migrationBuilder.DeleteData("preferencia_usuarios", "id", 3L);
            migrationBuilder.DeleteData("preferencia_usuarios", "id", 4L);

            migrationBuilder.DeleteData("destinos", "id", 1L);
            migrationBuilder.DeleteData("destinos", "id", 2L);
            migrationBuilder.DeleteData("destinos", "id", 3L);
            migrationBuilder.DeleteData("destinos", "id", 4L);
            migrationBuilder.DeleteData("destinos", "id", 5L);
            migrationBuilder.DeleteData("destinos", "id", 6L);

            migrationBuilder.DeleteData("usuarios", "id", 1L);
            migrationBuilder.DeleteData("usuarios", "id", 2L);
            migrationBuilder.DeleteData("usuarios", "id", 3L);
            migrationBuilder.DeleteData("usuarios", "id", 4L);

            migrationBuilder.DeleteData("preferencias", "id", 1L);
            migrationBuilder.DeleteData("preferencias", "id", 2L);
            migrationBuilder.DeleteData("preferencias", "id", 3L);
            migrationBuilder.DeleteData("preferencias", "id", 4L);
            migrationBuilder.DeleteData("preferencias", "id", 5L);

            migrationBuilder.DeleteData("continentes", "id", 1L);
            migrationBuilder.DeleteData("continentes", "id", 2L);
            migrationBuilder.DeleteData("continentes", "id", 3L);
            migrationBuilder.DeleteData("continentes", "id", 4L);
            migrationBuilder.DeleteData("continentes", "id", 5L);
            migrationBuilder.DeleteData("continentes", "id", 6L);
        }
    }
}