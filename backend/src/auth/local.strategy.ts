import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { BasicStrategy as Strategy } from 'passport-http';

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      passReqToCallback: true,
    });
  }

  // Función que validará los datos que se pasan
  async validate(req: Request, username: string, password: string): Promise<any> {

    if (
      process.env.BACKEND_USERNAME === username &&
      process.env.BACKEND_PASSWORD === password
    ) {
      return true;
    }

    // Si los valores no son correctos, se envía una excepción
    throw new UnauthorizedException();
  }
}
