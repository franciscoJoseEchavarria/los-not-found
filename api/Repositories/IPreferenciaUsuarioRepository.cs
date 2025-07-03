using Api.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Api.Repositories
{
    public interface IPreferenciaUsuarioRepository
    {
        Task<IEnumerable<PreferenciaUsuario>> GetAllAsync();
        Task<PreferenciaUsuario?> GetByIdAsync(long id);
        Task<PreferenciaUsuario> CreateAsync(PreferenciaUsuario preferenciaUsuario);
        Task<PreferenciaUsuario?> UpdateAsync(PreferenciaUsuario preferenciaUsuario);
        Task<bool> DeleteAsync(long id);
        Task<bool> ExistsAsync(long id);
    }
}

