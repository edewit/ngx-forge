import { UserSelection } from '../model/user-selection.model';

/**
 * Abstract GitHub provider service provided to ensure consumer implements this pattern
 */
export abstract class GitProviderService {

  /**
   * Authorize GitHub account
   */
  abstract authorize(val: UserSelection): void;
}
