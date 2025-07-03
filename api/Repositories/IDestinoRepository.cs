using Api.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Api.Repositories
{
    public interface IDestinoRepository
    {
        Task<IEnumerable<Destino>> GetAllAsync();
        Task<Destino?> GetByIdAsync(long id);
        Task<Destino> CreateAsync(Destino destino);
        Task<Destino?> UpdateAsync(Destino destino);
        Task<bool> DeleteAsync(long id);
        Task<IEnumerable<Destino>> GetDestinosByEmailAsync(string email);
    }
}

