import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { InscripcionAbiertaGuard } from './core/guards/inscripcion-abierta.guard';
import { InscripcionCerradaGuard } from './core/guards/inscripcion-cerrada.guard';
import { CustomRoutes } from './core/interfaces/custom-route.interface';

const routes: CustomRoutes = [
  {
    path: '',
    data: {
      webtitle: 'Almuerzo Especial Trabajador',
      webdescription: 'Regístrate en el almuerzo especial que se encuentra organizando la'
        + ' Universidad Nacional Mayor de San Marcos',
    },
    canActivate: [
      InscripcionAbiertaGuard,
    ],
    canLoad: [
      InscripcionAbiertaGuard,
    ],
    loadComponent: () =>
      import('./ui/almuerzo-especial/almuerzo-especial.component')
        .then((m) => m.AlmuerzoEspecialPage),
  },
  {
    path: 'inscripcion-cerrada',
    data: {
      webtitle: 'Inscripcion cerrada | Almuerzo Especial Trabajador',
      webdescription: 'Lo sentimos, ya se cerró las inscripciones al'
        + ' almuerzo especial de la Universidad Nacional Mayor de San Marcos',
    },
    canActivate: [
      InscripcionCerradaGuard,
    ],
    canLoad: [
      InscripcionCerradaGuard,
    ],
    loadComponent: () =>
      import('./ui/inscripcion-cerrada/inscripcion-cerrada.component')
        .then((m) => m.InscripcionCerradaPage),
  },
  {
    path: '**',
    data: {
      webtitle: 'Página no encontrada | Almuerzo Especial Trabajador',
      webdescription: 'Página no encontrada',
    },
    loadComponent: () =>
      import('./ui/not-found/not-found.component').then(
        (mod) => mod.NotFoundPage
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: true,
    scrollPositionRestoration: 'enabled',
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
