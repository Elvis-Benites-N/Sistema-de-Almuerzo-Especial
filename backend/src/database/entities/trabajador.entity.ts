import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity({
  schema: 'core',
  name: 'tp_trabajador',
})
export class Trabajador {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  nombres: string;

  @Column()
  apellidos: string;

  @Column({
    name: 'tipo_documento',
  })
  tipoDocumento: string;

  @Column({
    name: 'numero_documento',
  })
  numeroDocumento: string;

  @Column()
  estado: string;

  @Column({name: 'estado_planilla'})
  estadoPlanilla: string;

  @Column({
    name: 'tipo_trabajador',
  })
  tipoTrabajador: string;

  
  @Column({name: 'codigo_trabajador'})
  codigoTrabajador: string;
}
