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
/*
  getPipelines(): Observable<Pipeline[]> {
    let runtimeEndPoint: string = this.END_POINT + this.API_BASE;
    return this.options.flatMap((option) => {
      return this.http.get(runtimeEndPoint, option)
        .map(response => response.json() as Pipeline[])
        .map(pipelines => {
          // needs to filter out associated pipelines from list of pipelines
          return pipelines.filter(item => {
            return item.platform === 'maven';
          });
        })
        .catch(this.handleError);
    });
  }
*/
  // Save for demo
  getPipelines(): Observable<Pipeline[]> {
    let pipelines = Observable.of([{
      'id': 'maven-release',
      'platform': 'maven',
      'name': 'Release',
      'description': 'Maven based pipeline which:\\n\\n' +
        '* creates a new version then builds and deploys the project into the maven repository\\n' +
        '* runs an integration test in the **Test** environment',
      'stages': [{
        'name': 'Build Release',
        'description': 'Creates a new version then builds and deploys the project into the maven repository'
      }, {
        'name': 'Integration Test',
        'description': 'Runs an integration test in the **Test** environment'
      }],
      'suggested': false,
      'techpreview': false
    }, {
      'id': 'maven-releaseandstage',
      'platform': 'maven',
      'name': 'Release and Stage',
      'description': 'Maven based pipeline which:\\n\\n' +
      '* creates a new version then builds and deploys the project into the maven repository\\n' +
      '* runs an integration test in the **Test** environment\\n' +
      '* stages the new version into the **Stage** environment',
      'stages': [{
        'name': 'Build Release',
        'description': 'Creates a new version then builds and deploys the project into the maven repository'
      }, {
        'name': 'Integration Test',
        'description': 'Runs an integration test in the **Test** environment'
      }, {
        'name': 'Rollout to Stage',
        'description': 'Stages the new version into the **Stage** environment'
      }],
      'suggested': false,
      'techpreview': false
    }, {
      'id': 'maven-releasestageapproveandpromote',
      'platform': 'maven',
      'name': 'Release, Stage, Approve and Promote',
      // Description currently unused
      'description': 'Maven based pipeline which:\\n\\n ' +
      '* creates a new version then builds and deploys the project into the maven repository\n ' +
      '* runs an integration test in the **Test** environment\\n ' +
      '* stages the new version into the **Stage** environment\\n ' +
      '* waits for **Approval** to promote\\n ' +
      '* promotes to the **Run** environment',
      'stages': [{
        'name': 'Build Release',
        'description': 'Creates a new version then builds and deploys the project into the maven repository'
      }, {
        'name': 'Integration Test',
        'description': 'Runs an integration test in the **Test** environment'
      }, {
        'name': 'Rollout to Stage',
        'description': 'Stages the new version into the **Stage** environment'
      }, {
        'name': 'Approve',
        'description': 'Waits for **Approval** to promote'
      }, {
        'name': 'Rollout to Run',
        'description': 'Promotes to the **Run** environment'
      }],
      'suggested': true,
      'techpreview': true
    }] as Pipeline[]);
    return pipelines;
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
