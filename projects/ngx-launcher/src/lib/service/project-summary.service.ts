import { Observable } from 'rxjs';

import { Projectile } from '../model/summary.model';

/**
 * Abstract project summary service provided to ensure consumer implements this pattern
 */
export abstract class ProjectSummaryService {
  /**
   * Set up the project for the given summary
   *
   * @param {Projectile} summary The project summary
   * @returns {Observable<boolean>}
   */
  abstract setup(summary: Projectile, retry?: number): Observable<any>;
}
