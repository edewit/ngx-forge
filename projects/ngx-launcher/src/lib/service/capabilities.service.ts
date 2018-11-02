import { Observable } from 'rxjs';
import { Capability } from '../model/capabilities.model';

export abstract class CapabilitiesService {
  /**
   * Retrieve capabilities list
   * @returns {Observable<Capability[]>}
   */
  abstract getCapabilities(): Observable<Capability[]>;
}
