import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Headers, Http, RequestOptions, Response } from '@angular/http';

import { DependencyCheck } from '../../app/launcher/launcher.module';
import { DependencyCheckService } from '../../app/launcher/launcher.module';

import { HelperService } from '../../app/launcher/service/helper.service';
import { TokenProvider } from '../../app/service/token-provider';

@Injectable()
export class DemoDependencyCheckService implements DependencyCheckService {

  private END_POINT: string = '';
  private API_BASE: string = 'booster-catalog/';
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

  /**
   * Returns project dependencies
   *
   * @returns {Observable<DependencyCheck>} Project dependencies
   */
  getDependencyCheck(): Observable<DependencyCheck> {
    return Observable.of({
      mavenArtifact: 'd4-345',
      groupId: 'io.openshift.booster',
      projectName: 'app-test-1',
      projectVersion: '1.0.0-SNAPSHOT',
      spacePath: '/myspace',
      dependencySnapshot: null
    });
  }

  /**
   * Returns available projects in a space
   *
   * @param  {string} spaceId
   * @returns Observable
   */
  getApplicationsInASpace(spaceId: string): Observable<any[]> {
    return Observable.of([{
      attributes: { name: 'app-apr-10-2018-4-25' }
    }, {
      attributes: { name: 'app-may-11-2018' }
    }, {
      attributes: { name: 'app-may-14-1-04' }
    }]);
  }

  /**
   * Validate the project name and returns a boolean value
   *
   * @param  {string} projectName
   * @returns boolean
   */
  validateProjectName(projectName: string): boolean {
    // allows only '-'
    const pattern = /^[a-z][a-z0-9-]{3,63}$/;
    return pattern.test(projectName);
  }

  /**
   * Validate the artifact id and returns a boolean value
   *
   * @param  {string} artifactId
   * @returns boolean
   */
  validateArtifactId(artifactId: string): boolean {
    // allows only '-'
    return this.validateProjectName(artifactId);
  }

  /**
   * Validates the group id with a regex and returns a boolean value
   *
   * @param  {string} groupId
   * @returns boolean
   */
  validateGroupId(groupId: string): boolean {
    // allows only '.'
    const pattern = /^[a-z][a-z0-9.]{3,63}$/;
    return pattern.test(groupId);
  }

  /**
   * Validates the project version with a regex and returns a boolean value
   *
   * @param  {string} projectVersion
   * @returns boolean
   */
  validateProjectVersion(projectVersion: string): boolean {
    // allows '.' and '-'
    const pattern = /^[a-z][a-z0-9-.]{3,63}$/;
    return pattern.test(projectVersion);
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


  private handleError(error: Response | any) {
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
