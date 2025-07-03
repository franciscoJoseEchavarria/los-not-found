using Api.DataContext;
using Api.Models;
using Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PreferenciaUsuariosController : ControllerBase
    {
        private readonly AmadeusContext _context;
        private readonly IPreferenciaUsuarioService _preferenciaUsuarioService;

        public PreferenciaUsuariosController(IPreferenciaUsuarioService preferenciaUsuarioService, AmadeusContext context)
        {
            _preferenciaUsuarioService = preferenciaUsuarioService;
            _context = context;
        }

        // GET: api/PreferenciaUsuarios
        [Authorize(Roles = "ADMIN")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PreferenciaUsuario>>> GetPreferenciaUsuarios()
        {
            var result = await _preferenciaUsuarioService.GetAllPreferenciaUsuariosAsync();
            return Ok(result);
        }
        [Authorize] // Solo usuarios autenticados pueden acceder
        // GET: api/PreferenciaUsuarios/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PreferenciaUsuario>> GetPreferenciaUsuario(long id)
        {
            var result = await _preferenciaUsuarioService.GetPreferenciaUsuarioByIdAsync(id);
            if (result == null)
                return NotFound();
            return Ok(result);
        }
        [Authorize] // Solo usuarios autenticados pueden acceder
        // POST: api/PreferenciaUsuarios
        [HttpPost]
        public async Task<ActionResult<PreferenciaUsuario>> PostPreferenciaUsuario(PreferenciaUsuario preferenciaUsuario)
        {
            var created = await _preferenciaUsuarioService.CreatePreferenciaUsuarioAsync(preferenciaUsuario);
            return CreatedAtAction(nameof(GetPreferenciaUsuario), new { id = created.Id }, created);
        }
        [Authorize] // Solo usuarios autenticados pueden acceder
        // PUT: api/PreferenciaUsuarios/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPreferenciaUsuario(long id, PreferenciaUsuario preferenciaUsuario)
        {
            if (id != preferenciaUsuario.Id)
                return BadRequest();

            var updated = await _preferenciaUsuarioService.UpdatePreferenciaUsuarioAsync(preferenciaUsuario);
            if (updated == null)
                return NotFound();

            return NoContent();
        }
        [Authorize] // Solo usuarios autenticados pueden acceder
        // DELETE: api/PreferenciaUsuarios/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePreferenciaUsuario(long id)
        {
            var deleted = await _preferenciaUsuarioService.DeletePreferenciaUsuarioAsync(id);
            if (!deleted)
                return NotFound();

            return NoContent();
        }

        [HttpPost("asignar")]
        public async Task<IActionResult> AsignarPreferencia([FromBody] PreferenciaRequest request)
        {
            // 1. Buscar al usuario por email
            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            if (usuario == null)
                return NotFound("Usuario no encontrado");

            // 2. Verificar si ya existe la combinación de preferencia
            var preferenciaExistente = await _context.Preferencias
                .FirstOrDefaultAsync(p =>
                    p.Entorno == request.Entorno &&
                    p.Clima == request.Clima &&
                    p.Actividad == request.Actividad &&
                    p.Alojamiento == request.Alojamiento &&
                    p.TiempoViaje == request.Tiempo_viaje &&
                    p.RangoEdad == request.Rango_edad
                );

            // 3. Si NO existe, crear una nueva fila en Preferencias
            if (preferenciaExistente == null)
            {
                preferenciaExistente = new Preferencia
                {
                    Entorno = request.Entorno,
                    Clima = request.Clima,
                    Actividad = request.Actividad,
                    Alojamiento = request.Alojamiento,
                    TiempoViaje = request.Tiempo_viaje,
                    RangoEdad = request.Rango_edad
                };

                _context.Preferencias.Add(preferenciaExistente);
                await _context.SaveChangesAsync();

                // 3.1Asociar la nueva preferencia con los destinos de Bora Bora (39) y Emiratos Árabes (40)
                var destinosPreferencia1 = new DestinosPreferencia
                {
                    PreferenciasId = preferenciaExistente.Id,
                    DestinosId = 39
                };
                var destinosPreferencia2 = new DestinosPreferencia
                {
                    PreferenciasId = preferenciaExistente.Id,
                    DestinosId = 40
                };

                _context.Entry(destinosPreferencia1).State = EntityState.Detached;
                _context.Entry(destinosPreferencia2).State = EntityState.Detached;

                _context.DestinosPreferencias.Add(destinosPreferencia1);
                _context.DestinosPreferencias.Add(destinosPreferencia2);
                await _context.SaveChangesAsync();
            }

            // 4. Guardar la asociación en la tabla PreferenciaUsuarios
            var asociacionExistente = await _context.PreferenciaUsuarios
            .FirstOrDefaultAsync(pu =>
                pu.UsuariosId == usuario.Id
             );

            if (asociacionExistente == null)
            {
                var nuevaAsociacion = new PreferenciaUsuario
                {
                    UsuariosId = usuario.Id,
                    PreferenciasId = preferenciaExistente.Id,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now
                };
                _context.PreferenciaUsuarios.Add(nuevaAsociacion);
                await _context.SaveChangesAsync();
            }
            else
            {
                asociacionExistente.PreferenciasId = preferenciaExistente.Id;
                asociacionExistente.UpdatedAt = DateTime.Now;
                _context.PreferenciaUsuarios.Update(asociacionExistente);
                await _context.SaveChangesAsync();
            }

            // 5. Retornar los destinos asociados a esta preferencia
            //    asumiendo que DestinosPreferencia relaciona PreferenciasId con DestinosId
            var destinosAsociados = await _context.DestinosPreferencias
                .Where(dp => dp.PreferenciasId == preferenciaExistente.Id)
                .Select(dp => dp.Destinos)
                .Distinct()
                .ToListAsync();

            return Ok(destinosAsociados);
        }


    }
}

