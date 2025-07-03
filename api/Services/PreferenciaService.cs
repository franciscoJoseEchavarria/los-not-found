using Api.Models;
using Api.Repositories;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Api.Services
{
    public class PreferenciaService : IPreferenciaService
    {
        private readonly IPreferenciaRepository _repository;

        public PreferenciaService(IPreferenciaRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<Preferencia>> GetAllPreferenciasAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<Preferencia?> GetPreferenciaByIdAsync(long id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<Preferencia> CreatePreferenciaAsync(Preferencia preferencia)
        {
            return await _repository.CreateAsync(preferencia);
        }

        public async Task<Preferencia?> UpdatePreferenciaAsync(Preferencia preferencia)
        {
            return await _repository.UpdateAsync(preferencia);
        }

        public async Task<bool> DeletePreferenciaAsync(long id)
        {
            return await _repository.DeleteAsync(id);
        }
    }
}

