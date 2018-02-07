import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { GitProviderService } from '../../app/launcher/launcher.module';

// Enable Access-Conrtol-Expose-Headers for CORS test
@Injectable()
export class DemoGitProviderService implements GitProviderService {
  constructor() {
  }

  /**
   * Authorize GitHub account
   *
   * @param {string} redirectUrl The URL to return back to from GitHub
   */
  authorize(redirectUrl: string): void {
    // let url = 'https://github.com/login/oauth/authorize?client_id=' + this.clientId +
    //  '&redirect_uri=' + encodeURIComponent(redirectUrl);
    this.redirectToAuth(redirectUrl);
  }

  /**
   * Get GitHub organizations
   *
   * @returns {Observable<any[]>}
   */
  getOrgs(): Observable<any[]> {
    // https://api.github.com/users/:username/orgs
    return Observable.of([{
      name: 'fabric8-launcher',
      url: 'https://github.com/fabric8-launcher'
    }, {
      name: 'patternfly',
      url: 'https://github.com/patternfly'
    }]);
  }

  /**
   * Get authenticate GitHub user
   *
   * @returns {Observable<any>}
   */
  getUser(): Observable<any> {
    return Observable.of({
      login: 'bdellasc',
      avatar_url: 'https://avatars0.githubusercontent.com/u/17882357?s=400&v=4'
    });
  }

  // Private

  private redirectToAuth(url: string) {
    window.location.href = url;
  }
}
