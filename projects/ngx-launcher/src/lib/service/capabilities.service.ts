import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Capability } from '../model/capabilities.model';

export abstract class CapabilitiesService {
  /**
   * Retrieve capabilities list
   * @returns {Observable<Capability[]>}
   */
  abstract getCapabilities(): Observable<Capability[]>;

  getFilteredCapabilities(): Observable<Capability[]> {
    return this.getCapabilities().pipe(map(capabilities => this.filter(capabilities)));
  }

  private filter(capabilities: Capability[]): Capability[] {
    for (let capability of capabilities) {
      delete capability.props.runtime;
    }
    return capabilities;
  }
}
