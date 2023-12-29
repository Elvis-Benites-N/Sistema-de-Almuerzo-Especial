import { InjectionToken } from '@angular/core';

export type Config = {
  readonly services: {
    readonly backend: {
      readonly url: string;
    };
  };
  readonly constantes: {
    readonly fechaMaximaInscripcion: string;
    readonly fechaMaximaInscripcionDate: string;
  },
  readonly banner: {
    readonly mostrar: string;
    readonly nombre: string;
  }
};

export const APP_CONFIG: InjectionToken<Config> = new InjectionToken<Config>(
  'Application Config'
);
