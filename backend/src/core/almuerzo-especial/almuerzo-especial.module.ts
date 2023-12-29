import { Module } from '@nestjs/common';
import { BasicStrategy } from 'src/auth/local.strategy';
import { AlmuerzoEspecialController } from './almuerzo-especial.controller';
import { AlmuerzoEspecialService } from './almuerzo-especial.service';

@Module({
  controllers: [AlmuerzoEspecialController],
  providers: [AlmuerzoEspecialService, BasicStrategy],
})
export class AlmuerzoEspecialModule { }
