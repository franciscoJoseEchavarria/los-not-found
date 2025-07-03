using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Api.DataContext;
using NuGet.Protocol;
using Api.Models;
using Api.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DestinosController : ControllerBase
    {
        private readonly IDestinoService _destinoService;

        public DestinosController(IDestinoService destinoService)
        {
            _destinoService = destinoService;
        }

        // GET: api/Destinos
        // Este endpoint solo será accesible para ADMIN
        [Authorize(Roles = "ADMIN")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Destino>>> GetDestinos()
        {
            var destinos = await _destinoService.GetAllDestinosAsync();
            return Ok(destinos);
        }
        [Authorize] // Solo usuarios autenticados pueden acceder
        // GET: api/Destinoes/by-email/user@example.com
        [HttpGet("by-email/{email}")]
        public async Task<ActionResult<IEnumerable<Destino>>> GetDestinosByEmail(string email)
        {
            var destinos = await _destinoService.GetDestinosByEmailAsync(email);
            if (destinos == null || destinos.Equals(null))
            {
                return NotFound("No se encontraron destinos para el correo proporcionado.");
            }
            return Ok(destinos);
        }
        [Authorize] // Solo usuarios autenticados pueden acceder
        // GET: api/Destinoes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Destino>> GetDestino(long id)
        {
            var destino = await _destinoService.GetDestinoByIdAsync(id);
            if (destino == null)
                return NotFound();
            return Ok(destino);
        }
        [Authorize] // Solo usuarios autenticados pueden acceder
        // PUT: api/Destinoes/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDestino(long id, Destino destino)
        {
            if (id != destino.Id)
                return BadRequest();

            var updatedDestino = await _destinoService.UpdateDestinoAsync(destino);
            if (updatedDestino == null)
                return NotFound();

            return NoContent();
        }
        [Authorize] // Solo usuarios autenticados pueden acceder
        // POST: api/Destinoes
        [HttpPost]
        public async Task<ActionResult<Destino>> PostDestino(Destino destino)
        {
            var createdDestino = await _destinoService.CreateDestinoAsync(destino);
            return CreatedAtAction(nameof(GetDestino), new { id = createdDestino.Id }, createdDestino);
        }
        [Authorize] // Solo usuarios autenticados pueden acceder
        // DELETE: api/Destinoes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDestino(long id)
        {
            var success = await _destinoService.DeleteDestinoAsync(id);
            if (!success)
                return NotFound();
            return NoContent();
        }
    }
}
