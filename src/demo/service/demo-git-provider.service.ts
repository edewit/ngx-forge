import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { GitHubDetails } from '../../app/launcher/model/github-details.model';
import { GitProviderService } from '../../app/launcher/launcher.module';
import { AuthHelperService } from '../../app/launcher/service/auth-provider.service';

const GitHubMock = require('../../assets/mock/demo-git-provider.json');

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
    let orgs = [];
    for (let i = 0; i < GitHubMock.organisations.length; i++) {
      orgs.push(GitHubMock.organisations[i].login);
    }
    let describe = [];
    for (let i = 0; i < GitHubMock.organisations.length; i++) {
      describe.push(GitHubMock.organisations[i].login);
    }
    let gitHubDetails = {
      authenticated: this.isPageRedirect() ? true : false,
      avatar: GitHubMock.user.avatar_url,
      login: GitHubMock.user.login,
      organizations: orgs,
      htmlUrl: GitHubMock.patternfly.html_url,
      url: GitHubMock.user.url,
      description: describe,
      visibility: GitHubMock.patternfly.private
    } as GitHubDetails;
    return this.isPageRedirect() ? Observable.of(gitHubDetails) : Observable.empty();
  }

  /**
   * Returns true if GitHub repo exists
   *
   * @param {string} fullName The GitHub full name (e.g., fabric8-launcher/ngx-launcher)
   * @returns {Observable<boolean>} True if GitHub repo exists
   */
  isGitHubRepo(org: string, repoName: string): Observable<boolean> {
    let result = (org === 'patternfly' && repoName === 'patternfly'); // Simulate a existing repo
    return Observable.of(result);
  }

  /**
   * Returns true if GitHub repo exists
   *
   * @param {string} org The GitHub org (e.g., fabric8-launcher/ngx-launcher)
   * @returns {Observable<boolean>} True if GitHub repo exists
   */
  getGitHubRepoList(org: string): Observable<any> {
    let repoList = ['fabric-ui', 'fabric-uxd'];
    return Observable.of(repoList);
  }

  // Private

  private isPageRedirect(): boolean {
    let result = this.getRequestParam('selection'); // simulate Github auth redirect
    return (result !== null);
  }

  private getRequestParam(name: string): string {
    let search = (window.location.search !== undefined && window.location.search.length > 0)
      ? window.location.search : window.location.href;
    let param = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(search);
    if (param !== null) {
      return decodeURIComponent(param[1]);
    }
    return null;
  }

  private redirectToAuth(url: string) {
    window.location.href = url;
    window.location.reload(true);
  }
}
