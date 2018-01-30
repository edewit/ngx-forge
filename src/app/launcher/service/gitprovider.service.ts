import { Observable } from 'rxjs';

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
   * @returns {Observable<any>}
   */
  abstract getRepoDetailsByFullName(fullName: string): Observable<any>;

  /**
   * Get authenticate GitHub user
   *
   * @returns {Observable<any>}
   */
  abstract getUser(): Observable<any>;

  /**
   * Get authentication token
   *
   * @returns {Observable<any>}
   */
  abstract getToken(): Observable<any>;
}
