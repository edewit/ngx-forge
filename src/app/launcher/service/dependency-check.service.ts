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

  /**
   * Returns applications in a space
   *
   * @param  {string} spaceId
   * @returns Observable
   */
  abstract getApplicationsInASpace(spaceId: string): Observable<any[]>;

  /**
   * Validates the project name with a regex and returns a boolean value
   *
   * @param  {string} projectName
   * @returns boolean
   */
  abstract validateProjectName(projectName: string): boolean;

  /**
   * Validates the artifact id with a regex and returns a boolean value
   *
   * @param  {string} artifactId
   * @returns boolean
   */
  abstract validateArtifactId(artifactId: string): boolean;

  /**
   * Validates the group id with a regex and returns a boolean value
   *
   * @param  {string} groupId
   * @returns boolean
   */
  abstract validateGroupId(groupId: string): boolean;

  /**
   * Validates the project version with a regex and returns a boolean value
   *
   * @param  {string} projectVersion
   * @returns boolean
   */
  abstract validateProjectVersion(projectVersion: string): boolean;
  abstract getBoosterInfo(missionId: string, runtimeId: string): Observable<string>;
}
