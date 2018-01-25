import { Observable } from 'rxjs';

import {
  GitHubRepo,
  GitHubRepoCommit,
  GitHubRepoDetails,
  GitHubRepoLastCommit,
  GitHubRepoLicense,
  GitHubUser
} from '../model/github.model';

/**
 * Abstract GitHub provider service provided to ensure consumer implements this pattern
 */
export abstract class GitProviderService {
  /**
   * Authorize GitHub account
   *
   * @param {string} redirectUrl The URL to return back to from GitHub
   */
  abstract authorize(redirectUrl: string): void;

  /**
   * Get GitHub repo details for given full name
   *
   * @param fullName The GitHub full name (e.g., fabric8-services/fabric8-wit)
   * @returns {Observable<GitHubRepoDetails>}
   */
  abstract getRepoDetailsByFullName(fullName: string): Observable<GitHubRepoDetails>;

  /**
   * Get authenticate GitHub user
   *
   * @returns {Observable<GitHubUser>}
   */
  abstract getUser(): Observable<GitHubUser>;

  /**
   * Get authentication token
   *
   * @returns {Observable<any>}
   */
  abstract getToken(): Observable<any>;
}
