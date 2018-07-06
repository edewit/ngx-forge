import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { TargetEnvironment, TargetEnvironmentService } from '../../app/launcher/launcher.module';

const mockTargetEnvironmments = require('../../assets/mock/demo-target-environment.json');

@Injectable()
export class DemoTargetEnvironmentService implements TargetEnvironmentService {

  /**
   * Returns target environments
   *
   * @returns {Observable<TargetEnvironment>} The target environments
   */
  getTargetEnvironments(): Observable<TargetEnvironment[]> {
    return Observable.from([mockTargetEnvironmments]);
  }
}
