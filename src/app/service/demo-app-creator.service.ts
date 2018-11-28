import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

import { Runtime } from 'projects/ngx-launcher/src/lib/launcher.module.js';
import { Capability, Property } from 'projects/ngx-launcher/src/lib/model/capabilities.model';
import { AppCreatorService } from 'projects/ngx-launcher/src/public_api';

const mockCapabilities = require('../mock/demo-capabilities.json');
const mockRuntime = require('../mock/demo-runtimes.json');

@Injectable()
export class DemoAppCreatorService implements AppCreatorService {
  private enums: any;

  getCapabilities(): Observable<Capability[]> {
    return of(mockCapabilities).pipe(
      delay(2000)
     );
  }

  getRuntimes(): Observable<Runtime[]> {
    return of(mockRuntime).pipe(map((value) => {
      this.enums = value;
      return value.runtime;
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
          prop['value'] = prop['default'];
          props.push(prop);
        }
      }
      capability.props = props;
    }
    return capabilities;
  }

}
