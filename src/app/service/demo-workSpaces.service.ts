import { Observable, of } from 'rxjs';
import { WorkspaceLinks } from '../../../projects/ngx-launcher/src/lib/model/workspace.model';

/**
 * Abstract work space services
 */
export class DemoWorkSpacesService {

  /**
   * Create a workspace for given codebase ID
   *
   * @param codeBaseId The ID associated with the given workspace
   * @returns {Observable<WorkspaceLinks>}
   */
  createWorkSpace(codeBaseId: string): Observable<WorkspaceLinks> {
    return of({
      links: {
        open: 'che.openshift.io'
      }
    });
  }
}
