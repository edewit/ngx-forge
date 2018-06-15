import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { DependencyEditorService } from '../../app/launcher/launcher.module';

@Injectable()
export class DemoDependencyEditorService implements DependencyEditorService {

  getBoosterInfo(missionId: string, runtimeId: string, runtimeVersion: string): Observable<any> {
    return Observable.of([]);
  }

  getCoreDependencies(runtimeId: string): Observable<any> {
    return Observable.of({
      "_resolved": [
              {
                  "package": "com.googlecode.xmemcached:xmemcached",
                  "version": "2.3.2"
              }, 
              {
                  "package": "commons-fileupload:commons-fileupload",
                  "version": "1.3"
              }, 
              {
                  "package": "org.springframework.boot:spring-boot-starter-web",
                  "version": "1.4.1.RELEASE"
              },
              {
                  "package": "com.h2database:h2",
                  "version": "1.4.192"
              },
              {
                  "package": "org.springframework.boot:spring-boot-starter-data-jpa",
                  "version": "1.4.1.RELEASE"
              }
          ],
          "ecosystem": "maven" ,
          "request_id": "9e87322465b34e9aa97604a519e768de"
});
  }
}
