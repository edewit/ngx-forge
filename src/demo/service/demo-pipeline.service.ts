import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Headers, Http, RequestOptions, Response } from '@angular/http';

import { Pipeline } from '../../app/launcher/model/pipeline.model';
import { PipelineService } from '../../app/launcher/service/pipeline.service';

import { HelperService } from '../../app/launcher/service/helper.service';
import { TokenProvider } from '../../app/service/token-provider';

@Injectable()
export class DemoPipelineService implements PipelineService {

  // TODO: remove the hardcodes
  private END_POINT: string = '';
  private API_BASE: string = 'services/jenkins/pipelines';
  private ORIGIN: string = '';

  constructor(
    private http: Http,
    private helperService: HelperService,
    private tokenProvider: TokenProvider
  ) {
    if (this.helperService) {
      this.END_POINT = this.helperService.getBackendUrl();
      this.ORIGIN = this.helperService.getOrigin();
    }
  }

  private get options(): Observable<RequestOptions> {
    let headers = new Headers();
    headers.append('X-App', this.ORIGIN);
    return Observable.fromPromise(this.tokenProvider.token.then((token) => {
      headers.append('Authorization', 'Bearer ' + token);
      return new RequestOptions({
        headers: headers
      });
    }));
  }

  getPipelines(): Observable<Pipeline[]> {
    let runtimeEndPoint: string = this.END_POINT + this.API_BASE;
    return this.options.flatMap((option) => {
      return this.http.get(runtimeEndPoint, option)
        .map(response => response.json() as Pipeline[])
        .catch(this.handleError);
    });
  }

  private handleError(error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
