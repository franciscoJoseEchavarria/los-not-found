using Api.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Api.Repositories
{
    public interface IUsuarioRepository
    {
        Task<IEnumerable<Usuario>> GetAllAsync();
        Task<Usuario?> GetByIdAsync(long id);
        Task<Usuario?> GetByEmailAsync(string email);
        Task<Usuario> CreateAsync(Usuario usuario);
        Task<Usuario?> UpdateUsuarioByEmailAsync(string email, Usuario usuario);
        Task<bool> DeleteAsync(long id);
        Task<bool> ExistsAsync(long id);
        Task<Usuario> RegisterUsuarioAsync(Usuario usuario);
        Task<IEnumerable<Usuario>> GetAllWithPreferencesAndDestinationsAsync();
    }
}
