import { Module } from '@nestjs/common';
import { AlmuerzoEspecialModule } from './almuerzo-especial/almuerzo-especial.module';

@Module({
  imports: [AlmuerzoEspecialModule],
})
export class CoreModule {}
