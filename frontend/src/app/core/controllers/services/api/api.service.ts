import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, Injector } from '@angular/core';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';

export interface URLParam {
  readonly url: string;
  readonly params: string[];
}

interface IGetDelete<DataQuery> {
  readonly url?: string | URLParam;
  readonly query?: DataQuery;
  readonly headers?: HttpHeaders;
}

interface IPostPatch<DataRequest> {
  readonly url?: string | URLParam;
  readonly request?: DataRequest;
  readonly headers?: HttpHeaders;
}

@Injectable({
  providedIn: 'root',
})
export class APIService {
  protected readonly http: HttpClient;
  protected readonly baseURL: string;
  protected readonly prefix: string;

  constructor(
    private readonly injector: Injector,
    @Inject(String)
    baseURL: string,
    @Inject(String)
    prefix?: string
  ) {
    this.http = this.injector.get(HttpClient);
    this.baseURL = baseURL;
    this.prefix = prefix ?? '';
  }

  protected get<DataResponse, DataQuery>(
    getData?: IGetDelete<DataQuery>
  ): Promise<DataResponse> {
    const params = this.construirQueryParam(getData?.query);
    const endpoint = this.safeEndpoint(
      `${this.prefix}/${this.processURL(getData?.url)}`
    );

    return firstValueFrom(
      this.http.get<DataResponse>(`${this.baseURL}/${endpoint}`, {
        params,
        headers: getData.headers
      })
    );
  }

  protected post<DataResponse, DataRequest>(
    postData?: IPostPatch<DataRequest>
  ): Promise<DataResponse> {
    const endpoint = this.safeEndpoint(
      `${this.prefix}/${this.processURL(postData?.url)}`
    );

    return firstValueFrom(
      this.http.post<DataResponse>(
        `${this.baseURL}/${endpoint}`,
        postData?.request,{
          headers: postData.headers,
        }
      )
    );
  }

  protected patch<DataResponse, DataRequest>(
    patchData?: IPostPatch<DataRequest>
  ): Promise<DataResponse> {
    const endpoint = this.safeEndpoint(
      `${this.prefix}/${this.processURL(patchData?.url)}`
    );

    return firstValueFrom(
      this.http.patch<DataResponse>(
        `${this.baseURL}/${endpoint}`,
        patchData?.request
      )
    );
  }

  protected delete<DataResponse, DataQuery>(
    deleteData?: IGetDelete<DataQuery>
  ): Promise<DataResponse> {
    const params = this.construirQueryParam(deleteData?.query);
    const endpoint = this.safeEndpoint(
      `${this.prefix}/${this.processURL(deleteData?.url)}`
    );

    return firstValueFrom(
      this.http.delete<DataResponse>(`${this.baseURL}/${endpoint}`, {
        params,
      })
    );
  }

  protected getBlob<DataQuery>(getData?: IGetDelete<DataQuery>): Promise<Blob> {
    const params = this.construirQueryParam(getData.query);
    const endpoint = this.safeEndpoint(
      `${this.prefix}/${this.processURL(getData.url)}`
    );

    return firstValueFrom(
      this.http.get(`${this.baseURL}/${endpoint}`, {
        params,
        responseType: 'blob',
      })
    );
  }

  protected postBlob<DataQuery>(
    postData?: IPostPatch<DataQuery>
  ): Promise<Blob> {
    const endpoint = this.safeEndpoint(
      `${this.prefix}/${this.processURL(postData?.url)}`
    );

    return firstValueFrom(
      this.http.post(`${this.baseURL}/${endpoint}`, postData?.request, {
        responseType: 'blob',
      })
    );
  }

  private construirQueryParam(query: any): {
    [param: string]: string;
  } {
    const params: {
      [param: string]: string;
    } = {};

    if (!query) return params;

    Object.keys(query).forEach((key) => {
      if (
        query[key] === null ||
        query[key] === undefined ||
        query[key].toString().trim().length === 0
      )
        return;

      params[key] = query[key].toString();
    });

    return params;
  }

  private safeEndpoint(endpoint: string): string {
    return endpoint
      .split('/')
      .filter((e) => e.length > 0)
      .join('/');
  }

  private processURL(data: string | URLParam): string {
    if (!data) return '';

    if (typeof data === 'string') return data;

    let baseURL = data.url;

    for (let i = 0; i < data.params.length; i++) {
      baseURL = baseURL.replace('$' + (i + 1), data.params[i]);
    }

    return baseURL;
  }

}
