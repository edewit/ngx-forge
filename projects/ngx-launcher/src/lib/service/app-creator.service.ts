import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Capability } from '../model/capabilities.model';
import { Runtime } from '../model/runtime.model';

export abstract class AppCreatorService {
  /**
   * Retrieve capabilities list
   * @returns {Observable<Capability[]>}
   */
  abstract getCapabilities(): Observable<Capability[]>;

  abstract getRuntimes(): Observable<Runtime[]>;

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
