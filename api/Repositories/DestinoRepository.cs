using Api.DataContext;
using Api.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Api.Repositories
{
    public class DestinoRepository : IDestinoRepository
    {
        private readonly AmadeusContext _context;

        public DestinoRepository(AmadeusContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Destino>> GetAllAsync()
        {
            return await _context.Destinos.ToListAsync();
        }

        public async Task<Destino?> GetByIdAsync(long id)
        {
            return await _context.Destinos.FindAsync(id);
        }

        public async Task<Destino> CreateAsync(Destino destino)
        {
            _context.Destinos.Add(destino);
            await _context.SaveChangesAsync();
            return destino;
        }

        public async Task<Destino?> UpdateAsync(Destino destino)
        {
            if (!await _context.Destinos.AnyAsync(d => d.Id == destino.Id))
                return null;

            _context.Entry(destino).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return destino;
        }

        public async Task<bool> DeleteAsync(long id)
        {
            var destino = await _context.Destinos.FindAsync(id);
            if (destino == null)
                return false;

            _context.Destinos.Remove(destino);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<Destino>> GetDestinosByEmailAsync(string email)
        {
            var destinos = await _context.Usuarios
                .AsNoTracking()
                .Where(u => u.Email == email)
                .Join(
                    _context.PreferenciaUsuarios,
                    usuario => usuario.Id,
                    prefUsuario => prefUsuario.UsuariosId,
                    (usuario, prefUsuario) => prefUsuario.PreferenciasId
                )
                .Where(prefId => prefId.HasValue)
                .Select(prefId => prefId.Value)
                .Distinct()
                .Join(
                    _context.DestinosPreferencias,
                    prefId => prefId,
                    destPref => destPref.PreferenciasId,
                    (prefId, destPref) => destPref.DestinosId
                )
                .Join(
                    _context.Destinos,
                    destId => destId,
                    destino => destino.Id,
                    (destId, destino) => destino
                )
                .Distinct()
                .ToListAsync();

            if (!destinos.Any())
            {
                return await _context.Destinos
                    .AsNoTracking()
                    .Where(d => d.Id == 39 || d.Id == 40)
                    .ToListAsync();
            }

            return destinos;
        }
    }
}
