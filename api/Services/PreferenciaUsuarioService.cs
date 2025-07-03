using Api.Models;
using Api.Repositories;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Api.Services
{
    public class PreferenciaUsuarioService : IPreferenciaUsuarioService
    {
        private readonly IPreferenciaUsuarioRepository _repository;

        public PreferenciaUsuarioService(IPreferenciaUsuarioRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<PreferenciaUsuario>> GetAllPreferenciaUsuariosAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<PreferenciaUsuario?> GetPreferenciaUsuarioByIdAsync(long id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<PreferenciaUsuario> CreatePreferenciaUsuarioAsync(PreferenciaUsuario preferenciaUsuario)
        {
            return await _repository.CreateAsync(preferenciaUsuario);
        }

        public async Task<PreferenciaUsuario?> UpdatePreferenciaUsuarioAsync(PreferenciaUsuario preferenciaUsuario)
        {
            return await _repository.UpdateAsync(preferenciaUsuario);
        }

        public async Task<bool> DeletePreferenciaUsuarioAsync(long id)
        {
            return await _repository.DeleteAsync(id);
        }
    }
}

