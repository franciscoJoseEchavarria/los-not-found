using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Api.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "continentes",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    descripcion = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    nombre = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("continentes_pkey", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "preferencias",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    actividad = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    alojamiento = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    clima = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    entorno = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    rango_edad = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    tiempo_viaje = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("preferencias_pkey", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "usuarios",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    created_at = table.Column<DateTime>(type: "timestamp(6) without time zone", nullable: true),
                    email = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    nombre = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    password = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp(6) without time zone", nullable: true),
                    user_type = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false, defaultValue: "CLIENT")
                },
                constraints: table =>
                {
                    table.PrimaryKey("usuarios_pkey", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "destinos",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    comida_tipica = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp(6) without time zone", nullable: true),
                    idioma = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    img_url = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    lugar_imperdible = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    nombre = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    pais = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    continentes_id = table.Column<long>(type: "bigint", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("destinos_pkey", x => x.id);
                    table.ForeignKey(
                        name: "fkrk7e7gdcc8yoku5eo69q1tsfx",
                        column: x => x.continentes_id,
                        principalTable: "continentes",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "preferencia_usuarios",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    created_at = table.Column<DateTime>(type: "timestamp(6) without time zone", nullable: true),
                    updated_at = table.Column<DateTime>(type: "timestamp(6) without time zone", nullable: true),
                    preferencias_id = table.Column<long>(type: "bigint", nullable: true),
                    usuarios_id = table.Column<long>(type: "bigint", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("preferencia_usuarios_pkey", x => x.id);
                    table.ForeignKey(
                        name: "fk3fdxcfsotuv8gji3v0lg9aya3",
                        column: x => x.preferencias_id,
                        principalTable: "preferencias",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "fk3hxwg7yibg01euk8c0wxy93qa",
                        column: x => x.usuarios_id,
                        principalTable: "usuarios",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "destinos_preferencias",
                columns: table => new
                {
                    preferencias_id = table.Column<long>(type: "bigint", nullable: false),
                    destinos_id = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("destinos_preferencias_pkey", x => new { x.preferencias_id, x.destinos_id });
                    table.ForeignKey(
                        name: "fk3lwk5ehbhgvvcl721y9xasj9i",
                        column: x => x.destinos_id,
                        principalTable: "destinos",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "fkn97i9vn5nbx806tseoajw69um",
                        column: x => x.preferencias_id,
                        principalTable: "preferencias",
                        principalColumn: "id");
                });

            migrationBuilder.CreateIndex(
                name: "ukk8ce7fss8cy9megssacnggnts",
                table: "continentes",
                column: "nombre",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_destinos_continentes_id",
                table: "destinos",
                column: "continentes_id");

            migrationBuilder.CreateIndex(
                name: "uklffrnfiyqdj9vbjl1h02g6q3b",
                table: "destinos",
                column: "nombre",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_destinos_preferencias_destinos_id",
                table: "destinos_preferencias",
                column: "destinos_id");

            migrationBuilder.CreateIndex(
                name: "ukbe1ma940t4i053op4ikiqk4sy",
                table: "destinos_preferencias",
                columns: new[] { "preferencias_id", "destinos_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_preferencia_usuarios_preferencias_id",
                table: "preferencia_usuarios",
                column: "preferencias_id");

            migrationBuilder.CreateIndex(
                name: "IX_preferencia_usuarios_usuarios_id",
                table: "preferencia_usuarios",
                column: "usuarios_id");

            migrationBuilder.CreateIndex(
                name: "ukkfsp0s1tflm1cwlj8idhqsad0",
                table: "usuarios",
                column: "email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "destinos_preferencias");

            migrationBuilder.DropTable(
                name: "preferencia_usuarios");

            migrationBuilder.DropTable(
                name: "destinos");

            migrationBuilder.DropTable(
                name: "preferencias");

            migrationBuilder.DropTable(
                name: "usuarios");

            migrationBuilder.DropTable(
                name: "continentes");
        }
    }
}
