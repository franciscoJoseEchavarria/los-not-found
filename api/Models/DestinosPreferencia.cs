using System;
using Api.Models;

namespace Api.Models
{
    public partial class DestinosPreferencia
    {
        public long PreferenciasId { get; set; }
        public long DestinosId { get; set; }

        public virtual Destino Destinos { get; set; }
        public virtual Preferencia Preferencias { get; set; }
    }
}

