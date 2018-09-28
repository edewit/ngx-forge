import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DependencyCheckService } from '../../../projects/ngx-launcher/src/lib/service/dependency-check.service';
import { DependencyCheck } from '../../../projects/ngx-launcher/src/lib/model/dependency-check.model';

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
      mavenArtifact: 'd4-345',
      groupId: 'io.openshift.booster',
      projectName: 'app-test-1',
      projectVersion: '1.0.0-SNAPSHOT',
      spacePath: '/myspace',
      dependencySnapshot: null,
      targetEnvironment: undefined
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
