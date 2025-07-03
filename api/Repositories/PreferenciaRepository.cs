using Api.DataContext;
using Api.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Api.Repositories
{
    public class PreferenciaRepository : IPreferenciaRepository
    {
        private readonly AmadeusContext _context;

        public PreferenciaRepository(AmadeusContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Preferencia>> GetAllAsync()
        {
            return await _context.Preferencias.ToListAsync();
        }

        public async Task<Preferencia?> GetByIdAsync(long id)
        {
            return await _context.Preferencias.FindAsync(id);
        }

        public async Task<Preferencia> CreateAsync(Preferencia preferencia)
        {
            _context.Preferencias.Add(preferencia);
            await _context.SaveChangesAsync();
            return preferencia;
        }

        public async Task<Preferencia?> UpdateAsync(Preferencia preferencia)
        {
            if (!await ExistsAsync(preferencia.Id))
                return null;

            _context.Entry(preferencia).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return preferencia;
        }

        public async Task<bool> DeleteAsync(long id)
        {
            var preferencia = await _context.Preferencias.FindAsync(id);
            if (preferencia == null)
                return false;

            _context.Preferencias.Remove(preferencia);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ExistsAsync(long id)
        {
            return await _context.Preferencias.AnyAsync(e => e.Id == id);
        }
    }
}

