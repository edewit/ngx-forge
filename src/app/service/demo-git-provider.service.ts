import { Injectable } from '@angular/core';
import { EMPTY, Observable, of } from 'rxjs';
import { GitHubDetails } from '../../../projects/ngx-launcher/src/lib/model/github-details.model';
import { GitProviderService } from '../../../projects/ngx-launcher/src/lib/service/git-provider.service';

const GitHubMock = require('../mock/demo-git-provider.json');

// Enable Access-Conrtol-Expose-Headers for CORS test
@Injectable()
export class DemoGitProviderService implements GitProviderService {

  private existingRepo: { [name: string]: string } = {};

  constructor() {
    for (let i = 0; i < GitHubMock.organisations.length; i++) {
      this.existingRepo[GitHubMock.organisations[i].login] = GitHubMock.organisations[i].login;
    }
    this.existingRepo[GitHubMock.user.login] = undefined;
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
    const gitHubDetails = {
      authenticated: this.isPageRedirect() ? true : false,
      avatar: GitHubMock.user.avatar_url,
      login: GitHubMock.user.login,
      organizations: this.existingRepo
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
    return of(Object.keys(this.existingRepo).indexOf(repoName) != -1);
  }

  /**
   * Returns true if GitHub repo exists
   *
   * @param {string} org The GitHub org (e.g., fabric8-launcher/ngx-launcher)
   * @returns {Observable<boolean>} True if GitHub repo exists
   */
  getGitHubRepoList(): Observable<any> {
    return of(Object.keys(this.existingRepo));
  }

  // Private

  private isPageRedirect(): boolean {
    return window.location.href.indexOf('selectedSection') !== -1;
  }

  private redirectToAuth(url: string) {
    window.location.replace(url);
    window.location.reload();
  }
}
