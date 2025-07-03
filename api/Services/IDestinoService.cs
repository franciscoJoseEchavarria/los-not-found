using Api.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Api.Services
{
    public interface IDestinoService
    {
        Task<IEnumerable<Destino>> GetAllDestinosAsync();
        Task<Destino?> GetDestinoByIdAsync(long id);
        Task<Destino> CreateDestinoAsync(Destino destino);
        Task<Destino?> UpdateDestinoAsync(Destino destino);
        Task<bool> DeleteDestinoAsync(long id);
        Task<IEnumerable<Destino>> GetDestinosByEmailAsync(string email);
    }
}
