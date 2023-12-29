import { Inject, Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';
import { APP_CONFIG, Config } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class InscripcionAbiertaGuard implements CanActivate, CanLoad {

  private readonly inscripcionCerradaUrl = '/inscripcion-cerrada';

  constructor(
    @Inject(APP_CONFIG)
    private readonly config: Config,
    private readonly router: Router,
  ) { }

  canActivate(): boolean {
    return this.validate();
  }

  canLoad(): boolean {
    return this.validate();
  }

  private validate(): boolean {
    const fechaMaximaInscripcion = this.parseFecha();
    const ahora = new Date();

    if (fechaMaximaInscripcion.getFullYear() < ahora.getFullYear() ||
      fechaMaximaInscripcion.getMonth() < ahora.getMonth() ||
      fechaMaximaInscripcion.getDate() < ahora.getDate()
    ) {
      this.router.navigateByUrl(this.inscripcionCerradaUrl);
      return false;
    }

    return true;
  }

  private parseFecha(): Date {
    const fechaPartes = this.config.constantes.fechaMaximaInscripcionDate.split("-");
    const fechaMaximaInscripcion = new Date(
      Number(fechaPartes[2]),
      Number(fechaPartes[1]) - 1,
      Number(fechaPartes[0]),
    );

    return fechaMaximaInscripcion;
  }
}
