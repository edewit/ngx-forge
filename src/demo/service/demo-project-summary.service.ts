import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { Headers, Http, RequestOptions, Response } from '@angular/http';

import { ProjectSummaryService } from '../../app/launcher/service/project-summary.service';
import { Summary } from '../../app/launcher/model/summary.model';

import { HelperService } from '../../app/launcher/service/helper.service';
import { TokenProvider } from '../../app/service/token-provider';
import { Progress } from '../../app/launcher/model/progress.model';

@Injectable()
export class DemoProjectSummaryService implements ProjectSummaryService {

  constructor() {
  }

  setup(summary: Summary, spaceId: string, spaceName: string, isImport: boolean): Observable<any> {
    return Observable.of({'uuid_link': 'http://dummy-link.com/'});
  }

  getCurrentContext(): Observable<any> {
    return Observable.of({});
  }

  private handleError(error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string = '';
    if (error instanceof Response) {
      if (error.status !== 401) {
        const body = error.json() || '';
        const err = body.error || JSON.stringify(body);
        errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
      }
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

  private getPayload(summary: Summary, spaceId: string, spaceName: string) {
    let payload =
    'missionId=' + summary.mission.id +
    '&runtimeId=' + summary.runtime.id +
    '&runtimeVersion=' + summary.runtime.version.id +
    '&pipelineId=' + summary.pipeline.id +
    '&projectName=' + summary.dependencyCheck.projectName +
    '&projectVersion=' + summary.dependencyCheck.projectVersion +
    '&groupId=' + summary.dependencyCheck.groupId +
    '&artifactId=' + summary.dependencyCheck.mavenArtifact +
    '&spacePath=' + spaceName +
    '&gitRepository=' + summary.gitHubDetails.repository +
    '&spaceId=' + spaceId;
    summary.dependencyEditor.dependencySnapshot.forEach(i => {
      payload += '&dependency=' + i.package + ':' + i.version;
    });
    if (summary.gitHubDetails.login !== summary.gitHubDetails.organization) {
      payload += '&gitOrganization=' + summary.gitHubDetails.organization;
    }
    return payload;
  }

}
