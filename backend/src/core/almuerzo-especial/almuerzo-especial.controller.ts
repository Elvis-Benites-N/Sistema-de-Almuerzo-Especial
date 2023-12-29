import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { ResponseAPI } from 'src/common/interfaces/response-api.interface';
import { AlmuerzoEspecialService } from './almuerzo-especial.service';
import { ObtenerTrabajadorRRHHRequest, ObtenerTrabajadorRRHHResponse } from './dto/obtener-trabajador-rrhh.dto';
@UseGuards(LocalAuthGuard)
@Controller()
export class AlmuerzoEspecialController {
  constructor(private readonly service: AlmuerzoEspecialService) {}

  @Get()
  obtenerTrabajadorRRHH(
    @Query()
    request: ObtenerTrabajadorRRHHRequest,
  ): Promise<ObtenerTrabajadorRRHHResponse> {
    return this.service.obtenerTrabajadorRRHH(request);
  }

  @Post()
  registrarTrabajador(
    @Body()
    request: ObtenerTrabajadorRRHHRequest,
  ): Promise<ResponseAPI>  {
    return this.service.registrarTrabajador(request);
  }

}
