import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

import { Capability, Property } from 'projects/ngx-launcher/src/lib/model/capabilities.model';
import { Enums } from 'projects/ngx-launcher/src/lib/model/runtime.model';
import { AppCreatorService } from 'projects/ngx-launcher/src/public_api';

const mockCapabilities = require('../mock/demo-capabilities.json');
const mockEnums = require('../mock/demo-capability-enums.json');

@Injectable()
export class DemoAppCreatorService implements AppCreatorService {
  private enums: any;

  getCapabilities(): Observable<Capability[]> {
    return of(mockCapabilities).pipe(
      delay(2000)
     );
  }

  getEnums(): Observable<Enums> {
    return of(mockEnums).pipe(map((value) => {
      this.enums = value;
      return value;
    }), delay(2000));
  }

  getFilteredCapabilities(): Observable<Capability[]> {
    return this.getCapabilities().pipe(map(capabilities => this.filter(capabilities)));
  }

  private filter(capabilities: Capability[]): Capability[] {
    for (const capability of capabilities) {
      const props: Property[] = [];
      for (const prop of capability.props) {
        if (!prop.shared || prop.id === 'runtime') {
          prop.values = prop.id === 'runtime' ? prop.values : this.enums[prop.id];
          props.push(prop);
        }
      }
      capability.props = props;
    }
    return capabilities;
  }

}
