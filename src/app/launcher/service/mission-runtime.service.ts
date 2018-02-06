import { Observable } from 'rxjs';

import { Mission } from '../model/mission.model';
import { Runtime } from '../model/runtime.model';

/**
 * Abstract mission runtime service provided to ensure consumer implements this pattern
 */
export abstract class MissionRuntimeService {

  /**
   * Retrieve mission list
   * @returns {Observable<Mission[]>}
   */
  abstract getMissions(): Observable<Mission[]>;

  /**
   * Retrieve runtime list
   * @returns {Observable<Runtime[]>}
   */
  abstract getRuntimes(): Observable<Runtime[]>;
}
