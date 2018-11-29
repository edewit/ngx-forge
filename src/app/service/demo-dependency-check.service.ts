import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DependencyCheck } from '../../../projects/ngx-launcher/src/lib/model/dependency-check.model';
import { DependencyCheckService } from '../../../projects/ngx-launcher/src/lib/service/dependency-check.service';

@Injectable()
export class DemoDependencyCheckService implements DependencyCheckService {

  constructor() { }

  /**
   * Returns project dependencies
   *
   * @returns {Observable<DependencyCheck>} Project dependencies
   */
  getDependencyCheck(): Observable<DependencyCheck> {
    return of({
      mavenArtifact: 'newapp',
      groupId: 'com.yourcompany.newapp',
      projectName: 'app-test-1',
      projectVersion: '1.0.0-SNAPSHOT',
      spacePath: '/myspace',
      dependencySnapshot: null,
      targetEnvironment: location.href.indexOf('launcher') !== -1 ? undefined : 'os'
    });
  }

  /**
   * Returns available projects in a space
   *
   * @param  {string} spaceId
   * @returns Observable
   */
  getApplicationsInASpace(): Observable<any[]> {
    return of([{
      attributes: { name: 'app-apr-10-2018-4-25' }
    }, {
      attributes: { name: 'app-may-11-2018' }
    }, {
      attributes: { name: 'app-may-14-1-04' }
    }]);
  }
}
