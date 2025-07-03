using Api.DataContext;
using Api.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Api.Repositories
{
    public class PreferenciaUsuarioRepository : IPreferenciaUsuarioRepository
    {
        private readonly AmadeusContext _context;

        public PreferenciaUsuarioRepository(AmadeusContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<PreferenciaUsuario>> GetAllAsync()
        {
            return await _context.PreferenciaUsuarios.ToListAsync();
        }

        public async Task<PreferenciaUsuario?> GetByIdAsync(long id)
        {
            return await _context.PreferenciaUsuarios.FindAsync(id);
        }

        public async Task<PreferenciaUsuario> CreateAsync(PreferenciaUsuario preferenciaUsuario)
        {
            _context.PreferenciaUsuarios.Add(preferenciaUsuario);
            await _context.SaveChangesAsync();
            return preferenciaUsuario;
        }

        public async Task<PreferenciaUsuario?> UpdateAsync(PreferenciaUsuario preferenciaUsuario)
        {
            if (!await ExistsAsync(preferenciaUsuario.Id))
                return null;

            _context.Entry(preferenciaUsuario).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return preferenciaUsuario;
        }

        public async Task<bool> DeleteAsync(long id)
        {
            var entity = await _context.PreferenciaUsuarios.FindAsync(id);
            if (entity == null)
                return false;

            _context.PreferenciaUsuarios.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ExistsAsync(long id)
        {
            return await _context.PreferenciaUsuarios.AnyAsync(e => e.Id == id);
        }
    }
}

