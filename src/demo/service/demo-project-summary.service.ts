import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ProjectSummaryService } from '../../app/launcher/service/project-summary.service';
import { Summary } from '../../app/launcher/model/summary.model';

@Injectable()
export class DemoProjectSummaryService implements ProjectSummaryService {

  setup(summary: Summary): Observable<any> {
    return Observable.of({'uuid_link': 'http://dummy-link.com/'});
  }

  setupBlank(summary: Summary, spaceId: string, spaceName: string, isImport: boolean): Observable<any> {
    console.log('Inside setup blank');
    return Observable.of({'uuid_link': 'http://dummy-link.com/'});
  }

  getCurrentContext(): Observable<any> {
    return Observable.of({});
  }
}
