import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { DependencyEditorService } from '../../app/launcher/launcher.module';

@Injectable()
export class DemoDependencyEditorService implements DependencyEditorService {

  getBoosterInfo(missionId: string, runtimeId: string, runtimeVersion: string): Observable<any> {
    return Observable.of([]);
  }
}
