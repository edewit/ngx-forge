import { Observable } from 'rxjs';

import { Capability } from '../model/capabilities.model';
import { Enums } from '../model/runtime.model';

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
  abstract getEnums(): Observable<Enums>;

  abstract getFrontendCapabilities(): Observable<Capability[]>;

  abstract getFilteredCapabilities(): Observable<Capability[]>;
}
