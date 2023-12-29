import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs/internal/Observable';
import { throwError } from 'rxjs/internal/observable/throwError';
import { catchError } from 'rxjs/internal/operators/catchError';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      catchError((err) => {
        return throwError(() => this.handleException(err));
      })
    );
  }

  private handleException(err: any): HttpException {
    try {
      if (err.status === 'error')
        return new HttpException(
          'Algo salió mal, inténtelo más tarde',
          HttpStatus.BAD_GATEWAY
        );

      let error = err.message;

      if (err.error) {
        error = err.error;
      }

      if (err.response) {
        error = err.response;
      }

      return new HttpException(
        error ?? 'Algo salió mal, inténtelo más tarde',
        err.status ?? HttpStatus.INTERNAL_SERVER_ERROR
      );
    } catch {
      return new HttpException(
        'Algo salió mal, inténtelo más tarde',
        HttpStatus.BAD_GATEWAY
      );
    }
  }
}
