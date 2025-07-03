using Api.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Api.Services
{
    public interface IPreferenciaService
    {
        Task<IEnumerable<Preferencia>> GetAllPreferenciasAsync();
        Task<Preferencia?> GetPreferenciaByIdAsync(long id);
        Task<Preferencia> CreatePreferenciaAsync(Preferencia preferencia);
        Task<Preferencia?> UpdatePreferenciaAsync(Preferencia preferencia);
        Task<bool> DeletePreferenciaAsync(long id);
    }
}

