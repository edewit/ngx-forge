import { Observable } from 'rxjs';

import { GitHubDetails } from '../model/github-details.model';

/**
 * Abstract GitHub provider service provided to ensure consumer implements this pattern
 */
export abstract class GitProviderService {
  /**
   * Connect GitHub account
   *
   * @param {string} redirectUrl The GitHub redirect URL
   */
  abstract connectGitHubAccount(redirectUrl: string): void;

  /**
   * Returns GitHub details associated with the logged in user
   *
   * @returns {Observable<GitHubDetails>} The GitHub details associated with the logged in user
   */
  abstract getGitHubDetails(): Observable<GitHubDetails>;

  /**
   * Returns true if GitHub repo exists
   *
   * @param {string} org The GitHub org name (e.g. fabric8-launcher)
   * @param {string} repoName The GitHub repo name (e.g., ngx-launcher for fabric8-launcher/ngx-launcher)
   * @returns {Observable<boolean>} True if GitHub repo exists
   */
  abstract isGitHubRepo(org: string, repoName: string): Observable<boolean>;

  /**
   * Returns List of GitHub repos
   *
   * @param {string} org The GitHub Organisation (e.g., fabric8-launcher)
   * @returns {Observable<any>} List of GitHub repos
   */
  abstract getGitHubRepoList(org: string): Observable<any>;
}
