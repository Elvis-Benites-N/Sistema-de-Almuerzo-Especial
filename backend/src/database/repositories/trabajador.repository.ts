import { Repository } from 'typeorm';
import { Trabajador } from '../entities/trabajador.entity';
import { TrabajadorInsert } from './model-queries/trabajador.insert';
import { InjectRepository } from '@nestjs/typeorm';
import { ObtenerTrabajadorRRHHRequest } from 'src/core/almuerzo-especial/dto/obtener-trabajador-rrhh.dto';

export class TrabajadorRepository {
  constructor(
    @InjectRepository(Trabajador)
    private readonly repo: Repository<Trabajador>,
  ) {}

  create(data: TrabajadorInsert): Promise<Trabajador> {
    return this.repo.save(this.repo.create(data));
  }

  exists(query: ObtenerTrabajadorRRHHRequest): Promise<boolean>{
    return this.repo
      .createQueryBuilder('trabajador')
      .select([
        'trabajador.id',
      ])
      .where('trabajador.numeroDocumento = :numeroDocumento', {
        numeroDocumento: query.numeroDocumento
      })
      .getExists();
  }
}
