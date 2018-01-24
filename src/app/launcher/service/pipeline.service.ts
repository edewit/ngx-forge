import { Observable } from 'rxjs';
import { Pipeline } from '../model/pipeline.model';

/**
 * Abstract pipeline service provided to ensure consumer implements this pattern
 */
export abstract class PipelineService {

  /**
   * Retrieve pipeline list
   * @returns {Observable<Pipeline[]>}
   */
  abstract getPipelines(): Observable<Pipeline[]>;
}
