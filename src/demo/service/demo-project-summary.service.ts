import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ProjectSummaryService } from '../../app/launcher/service/project-summary.service';
import { Summary } from '../../app/launcher/model/summary.model';

@Injectable()
export class DemoProjectSummaryService implements ProjectSummaryService {

  setup(summary: Summary): Observable<any> {
    if (window.location.href.indexOf('import') !== -1) {
      return Observable.of({
        'uuid_link': 'http://dummy-link.com/',
        'events': [
          { 'name': 'OPENSHIFT_CREATE', 'message': 'Creating your project on OpenShift Online' },
          { 'name': 'OPENSHIFT_PIPELINE', 'message': 'Setting up your build pipeline' },
          { 'name': 'GITHUB_WEBHOOK', 'message': 'Configuring to trigger builds on Git pushes' }
        ]
      });
    }
    return Observable.of({
      'uuid_link': 'http://dummy-link.com/',
      'events': [
        { 'name': 'GITHUB_CREATE', 'message': 'Creating your new GitHub repository' },
        { 'name': 'GITHUB_PUSHED', 'message': 'Pushing your customized Booster code into the repo' },
        { 'name': 'OPENSHIFT_CREATE', 'message': 'Creating your project on OpenShift Online' },
        { 'name': 'OPENSHIFT_PIPELINE', 'message': 'Setting up your build pipeline' },
        { 'name': 'GITHUB_WEBHOOK', 'message': 'Configuring to trigger builds on Git pushes' }
      ]
    });
  }

}
