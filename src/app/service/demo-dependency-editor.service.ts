import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DependencyEditorService } from '../../../projects/ngx-launcher/src/lib/service/dependency-editor.service';

@Injectable()
export class DemoDependencyEditorService implements DependencyEditorService {

  getCoreDependencies(runtimeId: string): Observable<any> {
    return of({
      '_resolved': [
              {
                  'package': 'com.googlecode.xmemcached:xmemcached',
                  'version': '2.3.2'
              },
              {
                  'package': 'commons-fileupload:commons-fileupload',
                  'version': '1.3'
              },
              {
                  'package': 'org.springframework.boot:spring-boot-starter-web',
                  'version': '1.4.1.RELEASE'
              },
              {
                  'package': 'com.h2database:h2',
                  'version': '1.4.192'
              },
              {
                  'package': 'org.springframework.boot:spring-boot-starter-data-jpa',
                  'version': '1.4.1.RELEASE'
              }
          ],
          'ecosystem': 'maven' ,
          'request_id': '9e87322465b34e9aa97604a519e768de'
});
  }
}
