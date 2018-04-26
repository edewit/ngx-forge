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


}
