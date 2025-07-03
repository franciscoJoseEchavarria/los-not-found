using Api.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Api.Services
{
    public interface IPreferenciaUsuarioService
    {
        Task<IEnumerable<PreferenciaUsuario>> GetAllPreferenciaUsuariosAsync();
        Task<PreferenciaUsuario?> GetPreferenciaUsuarioByIdAsync(long id);
        Task<PreferenciaUsuario> CreatePreferenciaUsuarioAsync(PreferenciaUsuario preferenciaUsuario);
        Task<PreferenciaUsuario?> UpdatePreferenciaUsuarioAsync(PreferenciaUsuario preferenciaUsuario);
        Task<bool> DeletePreferenciaUsuarioAsync(long id);
    }
}

