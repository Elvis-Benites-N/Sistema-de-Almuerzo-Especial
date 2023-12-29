import { IsEnum, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { TipoBusquedaEnum } from '../enum/tipo-busqueda.enum';

export class ObtenerTrabajadorRRHHRequest {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(10)
  readonly numeroDocumento: string;

  @IsNotEmpty()
  @IsEnum(TipoBusquedaEnum)
  readonly idTipoBusqueda: TipoBusquedaEnum;
}

export interface ObtenerTrabajadorRRHHResponse{
  readonly trabajador: TrabajadorResponse;
  readonly puedeRegistrarse: boolean;
  readonly message?: string;
  readonly yaFueRegistrado: boolean;
}

export interface TrabajadorRRHH {
  readonly dni: string;
  readonly ap_paterno: string;
  readonly ap_materno: string;
  readonly nombres: string;
  readonly codigo: string;
  readonly dependencia: string;
  readonly dependencia_descripcion: string;
  readonly tipo_servidor: string;
  readonly codigo_estado: number;
  readonly estado: string;
  readonly codigo_estado_planilla: number;
  readonly estado_planilla: string;
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
