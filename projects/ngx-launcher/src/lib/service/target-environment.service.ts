import { Observable } from 'rxjs';

import { TargetEnvironment } from '../model/target-environment.model';

/**
 * Abstract target environment service provided to ensure consumer implements this pattern
 */
export abstract class TargetEnvironmentService {
  /**
   * Returns target environments
   *
   * @returns {Observable<TargetEnvironment>} The target environments
   */
  abstract getTargetEnvironments(): Observable<TargetEnvironment[]>;
}
