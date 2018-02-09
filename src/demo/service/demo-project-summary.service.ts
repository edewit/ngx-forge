import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { ProjectSummaryService } from '../../app/launcher/launcher.module';
import { Summary } from '../../app/launcher/launcher.module';

@Injectable()
export class DemoProjectSummaryService implements ProjectSummaryService {
  constructor() {
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
