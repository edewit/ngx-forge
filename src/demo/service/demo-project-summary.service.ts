import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Subscription } from 'rxjs/Subscription';

import { ProjectSummaryService } from '../../app/launcher/launcher.module';
import { Summary } from '../../app/launcher/launcher.module';

@Injectable()
export class DemoProjectSummaryService implements ProjectSummaryService {
  constructor() {
  }

  /**
   * Get Maven artifact
   *
   * @returns {Observable<string>}
   */
  getMavenArtifact(): Observable<string> {
    return Observable.of('d4.345');
  }

  /**
   * Get group ID
   *
   * @returns {Observable<string>}
   */
  getGroupId(): Observable<string> {
    return Observable.of('124-644');
  }

  /**
   * Get project name
   *
   * @returns {Observable<string>}
   */
  getProjectName(): Observable<string> {
    return Observable.of('App_test_1');
  }

  /**
   * Get project version
   *
   * @returns {Observable<string>}
   */
   getProjectVersion(): Observable<string> {
    return Observable.of('124.554');
  }

  /**
   * Get space path
   *
   * @returns {Observable<any>}
   */
  getSpacePath(): Observable<string> {
    return Observable.of('/myspace');
  }

  /**
   * Set up the project for the given summary
   *
   * @param {Summary} summary The project summary
   * @returns {Observable<boolean>}
   */
  setup(summary: Summary): Observable<boolean> {
    return Observable.of(true);
  }

  /**
   * Verify the project for the given summary
   *
   * @param {Summary} summary The project summary
   * @returns {Observable<boolean>}
   */
  verify(summary: Summary): Observable<boolean> {
    return Observable.of(true);
  }
}
