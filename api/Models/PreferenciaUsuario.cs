using System;
using System.Collections.Generic;

namespace Api.Models;

public partial class PreferenciaUsuario
{
    public long Id { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public long? PreferenciasId { get; set; }

    public long? UsuariosId { get; set; }

    public virtual Preferencia? Preferencias { get; set; }

    public virtual Usuario? Usuarios { get; set; }
}
