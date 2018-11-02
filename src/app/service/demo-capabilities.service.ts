import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { Capability } from 'projects/ngx-launcher/src/lib/model/capabilities.model';
import { CapabilitiesService } from 'projects/ngx-launcher/src/public_api';

const mockCapabilities = require('../mock/demo-capabilities.json');

@Injectable()
export class DemoCapabilitiesService implements CapabilitiesService {

  getCapabilities(): Observable<Capability[]> {
    return of(mockCapabilities).pipe(
      delay(2000)
     );
  }
}
