export interface ObtenerTrabajadorRRHHRequest {
  readonly numeroDocumento: string;
  readonly idTipoBusqueda: number;
}

export interface ObtenerTrabajadorRRHHResponse {
  readonly trabajador: TrabajadorResponse;
  readonly puedeRegistrarse: boolean;
  readonly message?: string;
  readonly yaFueRegistrado: boolean;
}
export interface TrabajadorResponse {
  readonly nombres: string;
  readonly apellidos: string;
  readonly tipoTrabajador: string;
  readonly estado: string;
  readonly estadoPlanilla: string;
  readonly dni: string;
  readonly codigoTrabajador: string;
}