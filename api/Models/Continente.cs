using System;
using System.Collections.Generic;

namespace Api.Models;

public partial class Continente
{
    public long Id { get; set; }

    public string? Descripcion { get; set; }

    public string Nombre { get; set; } = null!;

    public virtual ICollection<Destino> Destinos { get; set; } = new List<Destino>();
}
