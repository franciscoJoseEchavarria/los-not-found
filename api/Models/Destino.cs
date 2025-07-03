using System;
using System.Collections.Generic;

namespace Api.Models;

public partial class Destino
{
    public long Id { get; set; }

    public string? ComidaTipica { get; set; }

    public DateTime? CreatedAt { get; set; }

    public string? Idioma { get; set; }

    public string? ImgUrl { get; set; }

    public string? LugarImperdible { get; set; }

    public string Nombre { get; set; } = null!;

    public string? Pais { get; set; }

    public long? ContinentesId { get; set; }

    public virtual Continente? Continentes { get; set; }
}
