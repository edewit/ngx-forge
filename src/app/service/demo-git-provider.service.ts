import { Injectable } from '@angular/core';
import { EMPTY, Observable, of } from 'rxjs';
import { GitProviderService } from '../../../projects/ngx-launcher/src/lib/service/git-provider.service';
import { GitHubDetails } from '../../../projects/ngx-launcher/src/lib/model/github-details.model';

const GitHubMock = require('../mock/demo-git-provider.json');

// Enable Access-Conrtol-Expose-Headers for CORS test
@Injectable()
export class DemoGitProviderService implements GitProviderService {
  constructor() {
  }

  /**
   * Connect GitHub account
   *
   * @param {string} redirectUrl The GitHub redirect URL
   */
  connectGitHubAccount(redirectUrl: string): void {
    this.redirectToAuth(redirectUrl);
  }

  /**
   * Returns GitHub details associated with the logged in user
   *
   * @returns {Observable<GitHubDetails>} The GitHub details associated with the logged in user
   */
  getGitHubDetails(): Observable<GitHubDetails> {
    const orgs = [];
    for (let i = 0; i < GitHubMock.organisations.length; i++) {
      orgs.push(GitHubMock.organisations[i].login);
    }
    const gitHubDetails = {
      authenticated: this.isPageRedirect() ? true : false,
      avatar: GitHubMock.user.avatar_url,
      login: GitHubMock.user.login,
      organizations: orgs
    } as GitHubDetails;
    return this.isPageRedirect() ? of(gitHubDetails) : EMPTY;
  }

  /**
   * Returns true if GitHub repo exists
   *
   * @param {string} fullName The GitHub full name (e.g., fabric8-launcher/ngx-launcher)
   * @returns {Observable<boolean>} True if GitHub repo exists
   */
  isGitHubRepo(org: string, repoName: string): Observable<boolean> {
    const result = (org === 'patternfly' && repoName === 'patternfly'); // Simulate a existing repo
    return of(result);
  }

  /**
   * Returns true if GitHub repo exists
   *
   * @param {string} org The GitHub org (e.g., fabric8-launcher/ngx-launcher)
   * @returns {Observable<boolean>} True if GitHub repo exists
   */
  getGitHubRepoList(org: string): Observable<any> {
    const repoList = ['fabric-ui', 'fabric-uxd'];
    return of(repoList);
  }

  // Private

  private isPageRedirect(): boolean {
    return window.location.search.indexOf('MissionRuntime') !== -1;
  }

  private redirectToAuth(url: string) {
    window.location.replace(url);
  }
}
