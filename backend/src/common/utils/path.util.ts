import { join } from 'path';

export namespace PathUtil {
  export function getPath(resource: string): string {
    const rutaBase = process.cwd();
    let rutas: string[];

    if (process.env.MODE_ENV === 'prod') {
      rutas = [rutaBase, ...resource.split('/').filter((s) => s.length > 0)];
    } else {
      rutas = [
        rutaBase,
        'src',
        ...resource.split('/').filter((s) => s.length > 0),
      ];
    }

    return join(...rutas);
  }

  export function getPathEntities(): string {
    let rutas: string[] = ['database', 'entities', '**', '*.entity.js'];

    if (process.env.MODE_ENV === 'prod') return join(...rutas);

    rutas.unshift('dist');
    return join(...rutas);
  }
}
