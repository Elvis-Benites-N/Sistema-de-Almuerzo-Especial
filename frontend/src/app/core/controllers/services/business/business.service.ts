import { HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, Injector } from '@angular/core';
import { APP_CONFIG, Config } from 'src/app/core/config/config';
import { environment } from 'src/environments/environment';
import { APIService, URLParam } from '../api/api.service';

@Injectable({
  providedIn: 'root',
})
export class BusinessService extends APIService {
  constructor(
    injector: Injector,
    @Inject(APP_CONFIG)
    readonly config: Config
  ) {
    super(injector, config.services.backend.url);
  }

  methodGet<IResponse, IQuery>(
    url: string | URLParam,
    query?: IQuery
  ): Promise<IResponse> {
    return this.get<IResponse, IQuery>({
      url,
      query,
      headers: this.getHeaders(),
    });
  }

  methodPost<IResponse, IRequest>(
    url: string | URLParam,
    request?: IRequest
  ): Promise<IResponse> {
    return this.post<IResponse, IRequest>({
      url,
      request,
      headers: this.getHeaders(),
    });
  }

  methodPatch<IResponse, IRequest>(
    url: string | URLParam,
    request?: IRequest
  ): Promise<IResponse> {
    return this.patch<IResponse, IRequest>({
      url,
      request,
      headers: this.getHeaders(),
    });
  }

  methodDelete<IResponse, IQuery>(
    url: string | URLParam,
    query?: IQuery
  ): Promise<IResponse> {
    return this.delete<IResponse, IQuery>({
      url,
      query,
      headers: this.getHeaders(),
    });
  }

  methodGetReport<IQuery = {}>(url: string | URLParam, query?: IQuery) {
    return this.getBlob<IQuery>({
      url,
      query,
      headers: this.getHeaders(),
    });
  }

  methodPostReport<IRequest = {}>(url: string | URLParam, request?: IRequest) {
    return this.postBlob<IRequest>({
      url,
      request,
      headers: this.getHeaders(),
    });
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': 'Basic ' + btoa(`${environment.auth.username}:${environment.auth.password}`),
    })
  }
}
