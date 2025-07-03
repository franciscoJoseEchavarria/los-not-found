using System;
using System.Collections.Generic;

namespace Api.Models;

public partial class Preferencia
{
    public long Id { get; set; }

    public string? Actividad { get; set; }

    public string? Alojamiento { get; set; }

    public string? Clima { get; set; }

    public string? Entorno { get; set; }

    public string? RangoEdad { get; set; }

    public string? TiempoViaje { get; set; }

    public virtual ICollection<PreferenciaUsuario> PreferenciaUsuarios { get; set; } = new List<PreferenciaUsuario>();
}
