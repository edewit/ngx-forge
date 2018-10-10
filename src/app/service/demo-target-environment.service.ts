import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { TargetEnvironment, TargetEnvironmentService } from '../../../projects/ngx-launcher/src/lib/launcher.module';

const mockTargetEnvironmments = require('../mock/demo-target-environment.json');

@Injectable()
export class DemoTargetEnvironmentService implements TargetEnvironmentService {

  /**
   * Returns target environments
   *
   * @returns {Observable<TargetEnvironment>} The target environments
   */
  getTargetEnvironments(): Observable<TargetEnvironment[]> {
    return from([mockTargetEnvironmments]);
  }
}
