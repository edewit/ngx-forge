import { Observable } from 'rxjs';

import { Summary } from '../model/summary.model';

/**
 * Abstract project summary service provided to ensure consumer implements this pattern
 */
export abstract class ProjectSummaryService {
  /**
   * Get Maven artifact
   *
   * @returns {Observable<string>}
   */
  abstract getMavenArtifact(): Observable<string>;

  /**
   * Get group ID
   *
   * @returns {Observable<string>}
   */
  abstract getGroupId(): Observable<string>;

  /**
   * Get project name
   *
   * @returns {Observable<string>}
   */
  abstract getProjectName(): Observable<string>;

  /**
   * Get project version
   *
   * @returns {Observable<string>}
   */
  abstract getProjectVersion(): Observable<string>;

  /**
   * Get space path
   *
   * @returns {Observable<string>}
   */
  abstract getSpacePath(): Observable<string>;

  /**
   * Set up the project for the given summary
   *
   * @param {Summary} summary The project summary
   * @returns {Observable<boolean>}
   */
  abstract setup(summary: Summary): Observable<boolean>;

  /**
   * Verify the project for the given summary
   *
   * @param {Summary} summary The project summary
   * @returns {Observable<boolean>}
   */
  abstract verify(summary: Summary): Observable<boolean>;
}
