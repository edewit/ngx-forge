import { Observable } from 'rxjs';
import { Che } from '../model/che.model';

/**
 * Abstract Che service to get state of Che server
 */
export abstract class CheService {

  /**
   * Get state of Che server
   *
   * @returns {Observable<Che>}
   */
  abstract getState(): Observable<Che>;
}
