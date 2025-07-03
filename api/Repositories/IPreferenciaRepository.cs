using Api.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Api.Repositories
{
    public interface IPreferenciaRepository
    {
        Task<IEnumerable<Preferencia>> GetAllAsync();
        Task<Preferencia?> GetByIdAsync(long id);
        Task<Preferencia> CreateAsync(Preferencia preferencia);
        Task<Preferencia?> UpdateAsync(Preferencia preferencia);
        Task<bool> DeleteAsync(long id);
        Task<bool> ExistsAsync(long id);
    }
}

