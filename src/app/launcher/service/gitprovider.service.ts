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
   * Get GitHub organizations
   *
   * @returns {Observable<any[]>}
   */
  abstract getOrgs(): Observable<any[]>;

  /**
   * Get authenticate GitHub user
   *
   * @returns {Observable<any>}
   */
  abstract getUser(): Observable<any>;
}
