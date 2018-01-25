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
}
