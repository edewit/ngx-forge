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

  /**
   * Retrieve runtime list
   * @returns {Observable<Runtime[]>}
   */
  abstract getRuntimes(): Observable<Runtime[]>;

  abstract getFilteredCapabilities(): Observable<Capability[]>;
}
