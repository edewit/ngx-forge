import { Observable } from 'rxjs';

import { DependencyCheck } from '../model/dependency-check.model';

/**
 * Abstract dependency service provided to ensure consumer implements this pattern
 */
export abstract class DependencyCheckService {
  /**
   * Returns project dependencies
   *
   * @returns {Observable<DependencyCheck>} Project dependencies
   */
  abstract getDependencyCheck(): Observable<DependencyCheck>;
}
