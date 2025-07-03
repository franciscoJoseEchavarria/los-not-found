using Api.Models;
using Api.Repositories;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Api.Services
{
    public class DestinoService : IDestinoService
    {
        private readonly IDestinoRepository _destinoRepository;

        public DestinoService(IDestinoRepository destinoRepository)
        {
            _destinoRepository = destinoRepository;
        }

        public async Task<IEnumerable<Destino>> GetAllDestinosAsync()
        {
            return await _destinoRepository.GetAllAsync();
        }

        public async Task<Destino?> GetDestinoByIdAsync(long id)
        {
            return await _destinoRepository.GetByIdAsync(id);
        }

        public async Task<Destino> CreateDestinoAsync(Destino destino)
        {
            // Aquí puedes agregar lógica de validación o reglas de negocio adicionales.
            return await _destinoRepository.CreateAsync(destino);
        }

        public async Task<Destino?> UpdateDestinoAsync(Destino destino)
        {
            return await _destinoRepository.UpdateAsync(destino);
        }

        public async Task<bool> DeleteDestinoAsync(long id)
        {
            return await _destinoRepository.DeleteAsync(id);
        }

        public async Task<IEnumerable<Destino>> GetDestinosByEmailAsync(string email)
        {
            return await _destinoRepository.GetDestinosByEmailAsync(email);
        }
    }
}
