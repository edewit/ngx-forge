import { Observable, of } from 'rxjs';
import { Che } from '../../../projects/ngx-launcher/src/lib/model/che.model';

/**
 * Abstract Che service to get state of Che server
 */
export class DemoCheService {

  /**
   * Get state of Che server
   *
   * @returns {Observable<Che>}
   */
  getState(): Observable<Che> {
    return of({
      clusterFull: false,
      running: true,
      multiTenant: true
    });
  }
}
