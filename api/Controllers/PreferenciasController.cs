using Api.Models;
using Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PreferenciasController : ControllerBase
    {
        private readonly IPreferenciaService _preferenciaService;

        public PreferenciasController(IPreferenciaService preferenciaService)
        {
            _preferenciaService = preferenciaService;
        }

        // GET: api/Preferencias
        [Authorize(Roles = "ADMIN")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Preferencia>>> GetPreferencias()
        {
            var result = await _preferenciaService.GetAllPreferenciasAsync();
            return Ok(result);
        }
        [Authorize] // Solo usuarios autenticados pueden acceder
        // GET: api/Preferencias/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Preferencia>> GetPreferencia(long id)
        {
            var result = await _preferenciaService.GetPreferenciaByIdAsync(id);
            if (result == null)
                return NotFound();
            return Ok(result);
        }
        [Authorize] // Solo usuarios autenticados pueden acceder
        // POST: api/Preferencias
        [HttpPost]
        public async Task<ActionResult<Preferencia>> PostPreferencia(Preferencia preferencia)
        {
            var created = await _preferenciaService.CreatePreferenciaAsync(preferencia);
            return CreatedAtAction(nameof(GetPreferencia), new { id = created.Id }, created);
        }
        [Authorize] // Solo usuarios autenticados pueden acceder
        // PUT: api/Preferencias/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPreferencia(long id, Preferencia preferencia)
        {
            if (id != preferencia.Id)
                return BadRequest();

            var updated = await _preferenciaService.UpdatePreferenciaAsync(preferencia);
            if (updated == null)
                return NotFound();

            return NoContent();
        }
        [Authorize] // Solo usuarios autenticados pueden acceder
        // DELETE: api/Preferencias/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePreferencia(long id)
        {
            var deleted = await _preferenciaService.DeletePreferenciaAsync(id);
            if (!deleted)
                return NotFound();

            return NoContent();
        }
    }
}
