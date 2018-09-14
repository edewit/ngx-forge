import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ProjectSummaryService } from '../../../projects/ngx-launcher/src/lib/service/project-summary.service';
import { Projectile } from '../../../projects/ngx-launcher/src/lib/model/summary.model';

@Injectable()
export class DemoProjectSummaryService implements ProjectSummaryService {

  setup(summary: Projectile, retry?: number): Observable<any> {
    if (window.location.href.indexOf('import') !== -1) {
      return of({
        'uuid_link': 'http://import-link.com/',
        'events': [
          { 'name': 'OPENSHIFT_CREATE', 'message': 'Creating your project on OpenShift Online' },
          { 'name': 'OPENSHIFT_PIPELINE', 'message': 'Setting up your build pipeline' },
          { 'name': 'GITHUB_WEBHOOK', 'message': 'Configuring to trigger builds on Git pushes' }
        ]
      });
    }
    const link = retry ? 'http://retry-link.com/' : 'http://dummy-link.com/';
    return of({
      'uuid_link': link,
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
