namespace Api.Models;
public class PreferenciaRequest
{
    public string Email { get; set; }           // "probandsfds13@gmail.com"
    public string Entorno { get; set; }         // "CIUDAD"
    public string Clima { get; set; }           // "CALUROSO"
    public string Actividad { get; set; }       // "DEPORTES_Y_AVENTURAS"
    public string Alojamiento { get; set; }     // "HOTEL_LUJO"
    public string Tiempo_viaje { get; set; }     // "MENOR_UNA_SEMANA"
    public string Rango_edad { get; set; }       // "MENOR_QUE_TREINTA"
}