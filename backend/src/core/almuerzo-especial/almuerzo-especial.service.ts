import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DATABASES } from 'src/common/constants/database.constants';
import { ResponseAPI } from 'src/common/interfaces/response-api.interface';
import { Trabajador } from 'src/database/entities/trabajador.entity';
import { TrabajadorRepository } from 'src/database/repositories/trabajador.repository';
import { DataSource } from 'typeorm';
import {
  ObtenerTrabajadorRRHHRequest,
  ObtenerTrabajadorRRHHResponse,
  TrabajadorResponse,
  TrabajadorRRHH
} from './dto/obtener-trabajador-rrhh.dto';
import { TipoBusquedaEnum } from './enum/tipo-busqueda.enum';

enum CodigoEstadoEnum {
  Cesante = 3,
}

enum EstadoPlanillaEnum {
  Activo = 1,
}

@Injectable()
export class AlmuerzoEspecialService {
  private readonly logger = new Logger(AlmuerzoEspecialService.name);

  private readonly trabajadorRepository: TrabajadorRepository;

  constructor(
    private readonly dataSource: DataSource,
    @InjectDataSource(DATABASES.RRHH)
    private readonly dataSourceRRHH: DataSource,
  ) {
    this.trabajadorRepository = new TrabajadorRepository(
      this.dataSource.getRepository(Trabajador),
    );
  }

  async obtenerTrabajadorRRHH(
    request: ObtenerTrabajadorRRHHRequest,
  ): Promise<ObtenerTrabajadorRRHHResponse> {

    this.logger.verbose('====== BUSQUEDA TRABAJADOR ======');

    const response = await this.dataSourceRRHH.query<TrabajadorRRHH[]>('SELECT * FROM public.ft_servidores_sueldos WHERE ' +
      (request.idTipoBusqueda === TipoBusquedaEnum.DNI ? 'LOWER(TRIM(dni)) = $1' : 'LOWER(TRIM(codigo)) = $1'),
      [request.numeroDocumento.toLowerCase().trim()]);

    const trabajadorEncontrado = response.length > 0 ? response[0] : null;

    if (!trabajadorEncontrado) {
      this.logger.error('Trabajador no encontrado');
      throw new NotFoundException({
        message: 'Trabajador no encontrado',
      });
    }

    const existe = await this.trabajadorRepository.exists(request);

    if (existe) {
      this.logger.error('El usuario ya fue registrado');
      return {
        puedeRegistrarse: false,
        trabajador: this.parseTrabajador(trabajadorEncontrado),
        message: 'Su inscripción ya fue registrada',
        yaFueRegistrado: true,
      }
    }

    if (trabajadorEncontrado.codigo_estado === CodigoEstadoEnum.Cesante ||
      trabajadorEncontrado.codigo_estado_planilla !== EstadoPlanillaEnum.Activo) {
      this.logger.log('El usuario no es válido para registrarse');
      return {
        puedeRegistrarse: false,
        trabajador: this.parseTrabajador(trabajadorEncontrado),
        message: 'Lo sentimos, tu actual condición de trabajador no tiene los ' +
          'permisos necesarios para la inscripción al almuerzo especial.',
        yaFueRegistrado: false,
      }
    }

    this.logger.log('El usuario aún no se ha registrado');

    return {
      puedeRegistrarse: true,
      trabajador: this.parseTrabajador(trabajadorEncontrado),
      yaFueRegistrado: false,
    };
  }

  async registrarTrabajador(
    request: ObtenerTrabajadorRRHHRequest,
  ): Promise<ResponseAPI> {
    this.logger.verbose('====== REGISTRAR TRABAJADOR ======');

    const trabajadorResponse = await this.obtenerTrabajadorRRHH(request);

    if (!trabajadorResponse.puedeRegistrarse) {
      throw new ConflictException({
        message: trabajadorResponse.message,
      });
    }

    this.logger.log('Registrando trabajador...');
    await this.trabajadorRepository.create({
      nombres: trabajadorResponse.trabajador.nombres,
      apellidos: trabajadorResponse.trabajador.apellidos,
      estado: trabajadorResponse.trabajador.estado,
      estadoPlanilla: trabajadorResponse.trabajador.estadoPlanilla,
      numeroDocumento: trabajadorResponse.trabajador.dni,
      tipoDocumento: request.idTipoBusqueda === TipoBusquedaEnum.DNI ? 'DNI'
        : 'CÓD. TRABAJADOR',
      tipoTrabajador: trabajadorResponse.trabajador.tipoTrabajador,
      codigoTrabajador: trabajadorResponse.trabajador.codigoTrabajador,
    });
    this.logger.log('Trabajador registrado');

    return {
      message: 'Tu inscripción al almuerzo especial se ha realizado correctamente',
    };
  }

  private parseTrabajador(trabajador: TrabajadorRRHH): TrabajadorResponse {
    return {
      nombres: trabajador.nombres.trim(),
      apellidos: `${trabajador.ap_paterno} ${trabajador.ap_materno}`.trim(),
      codigoTrabajador: trabajador.codigo?.trim(),
      dni: trabajador.dni.trim(),
      estado: trabajador.estado.trim(),
      estadoPlanilla: trabajador.estado_planilla.trim(),
      tipoTrabajador: trabajador.tipo_servidor.trim(),
    }
  }


}
