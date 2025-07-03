using System;
using System.Collections.Generic;
using Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Api.DataContext
{
    public partial class AmadeusContext : DbContext
    {
        public AmadeusContext()
        {
        }

        public AmadeusContext(DbContextOptions<AmadeusContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Continente> Continentes { get; set; }

        public virtual DbSet<Destino> Destinos { get; set; }

        public virtual DbSet<DestinosPreferencia> DestinosPreferencias { get; set; }

        public virtual DbSet<Preferencia> Preferencias { get; set; }

        public virtual DbSet<PreferenciaUsuario> PreferenciaUsuarios { get; set; }

        public virtual DbSet<Usuario> Usuarios { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Continente>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("continentes_pkey");

                entity.ToTable("continentes");

                entity.HasIndex(e => e.Nombre, "ukk8ce7fss8cy9megssacnggnts").IsUnique();

                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.Descripcion)
                    .HasMaxLength(255)
                    .HasColumnName("descripcion");
                entity.Property(e => e.Nombre)
                    .HasMaxLength(255)
                    .HasColumnName("nombre");
            });

            modelBuilder.Entity<Destino>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("destinos_pkey");

                entity.ToTable("destinos");

                entity.HasIndex(e => e.Nombre, "uklffrnfiyqdj9vbjl1h02g6q3b").IsUnique();

                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.ComidaTipica)
                    .HasMaxLength(255)
                    .HasColumnName("comida_tipica");
                entity.Property(e => e.ContinentesId).HasColumnName("continentes_id");
                entity.Property(e => e.CreatedAt)
                    .HasColumnType("timestamp(6) without time zone")
                    .HasColumnName("created_at");
                entity.Property(e => e.Idioma)
                    .HasMaxLength(255)
                    .HasColumnName("idioma");
                entity.Property(e => e.ImgUrl)
                    .HasMaxLength(255)
                    .HasColumnName("img_url");
                entity.Property(e => e.LugarImperdible)
                    .HasMaxLength(255)
                    .HasColumnName("lugar_imperdible");
                entity.Property(e => e.Nombre)
                    .HasMaxLength(255)
                    .HasColumnName("nombre");
                entity.Property(e => e.Pais)
                    .HasMaxLength(255)
                    .HasColumnName("pais");

                entity.HasOne(d => d.Continentes).WithMany(p => p.Destinos)
                    .HasForeignKey(d => d.ContinentesId)
                    .HasConstraintName("fkrk7e7gdcc8yoku5eo69q1tsfx");
            });

            modelBuilder.Entity<DestinosPreferencia>(entity =>
            {
                entity.HasKey(e => new { e.PreferenciasId, e.DestinosId })
                      .HasName("destinos_preferencias_pkey"); 

                entity.ToTable("destinos_preferencias");

                entity.HasIndex(e => new { e.PreferenciasId, e.DestinosId }, "ukbe1ma940t4i053op4ikiqk4sy").IsUnique();

                entity.Property(e => e.DestinosId).HasColumnName("destinos_id");
                entity.Property(e => e.PreferenciasId).HasColumnName("preferencias_id");

                entity.HasOne(d => d.Destinos).WithMany()
                    .HasForeignKey(d => d.DestinosId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk3lwk5ehbhgvvcl721y9xasj9i");

                entity.HasOne(d => d.Preferencias).WithMany()
                    .HasForeignKey(d => d.PreferenciasId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fkn97i9vn5nbx806tseoajw69um");
            });

            modelBuilder.Entity<Preferencia>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("preferencias_pkey");

                entity.ToTable("preferencias");

                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.Actividad)
                    .HasMaxLength(255)
                    .HasColumnName("actividad");
                entity.Property(e => e.Alojamiento)
                    .HasMaxLength(255)
                    .HasColumnName("alojamiento");
                entity.Property(e => e.Clima)
                    .HasMaxLength(255)
                    .HasColumnName("clima");
                entity.Property(e => e.Entorno)
                    .HasMaxLength(255)
                    .HasColumnName("entorno");
                entity.Property(e => e.RangoEdad)
                    .HasMaxLength(255)
                    .HasColumnName("rango_edad");
                entity.Property(e => e.TiempoViaje)
                    .HasMaxLength(255)
                    .HasColumnName("tiempo_viaje");
            });

            modelBuilder.Entity<PreferenciaUsuario>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("preferencia_usuarios_pkey");

                entity.ToTable("preferencia_usuarios");

                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.CreatedAt)
                    .HasColumnType("timestamp(6) without time zone")
                    .HasColumnName("created_at");
                entity.Property(e => e.PreferenciasId).HasColumnName("preferencias_id");
                entity.Property(e => e.UpdatedAt)
                    .HasColumnType("timestamp(6) without time zone")
                    .HasColumnName("updated_at");
                entity.Property(e => e.UsuariosId).HasColumnName("usuarios_id");

                entity.HasOne(d => d.Preferencias).WithMany(p => p.PreferenciaUsuarios)
                    .HasForeignKey(d => d.PreferenciasId)
                    .HasConstraintName("fk3fdxcfsotuv8gji3v0lg9aya3");

                entity.HasOne(d => d.Usuarios).WithMany(p => p.PreferenciaUsuarios)
                    .HasForeignKey(d => d.UsuariosId)
                    .HasConstraintName("fk3hxwg7yibg01euk8c0wxy93qa");
            });

            modelBuilder.Entity<Usuario>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("usuarios_pkey");

                entity.ToTable("usuarios");

                entity.HasIndex(e => e.Email, "ukkfsp0s1tflm1cwlj8idhqsad0").IsUnique();

                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.CreatedAt)
                    .HasColumnType("timestamp(6) without time zone")
                    .HasColumnName("created_at");
                entity.Property(e => e.Email)
                    .HasMaxLength(255)
                    .HasColumnName("email");
                entity.Property(e => e.Nombre)
                    .HasMaxLength(255)
                    .HasColumnName("nombre");
                entity.Property(e => e.Password)
                    .HasMaxLength(255)
                    .HasColumnName("password");
                entity.Property(e => e.UpdatedAt)
                    .HasColumnType("timestamp(6) without time zone")
                    .HasColumnName("updated_at");
                entity.Property(e => e.UserType)
                    .HasMaxLength(10)
                    .HasColumnName("user_type")
                    .HasDefaultValue("CLIENT");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
