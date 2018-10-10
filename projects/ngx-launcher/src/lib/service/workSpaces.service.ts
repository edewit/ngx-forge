import { Observable } from 'rxjs';
import { WorkspaceLinks } from '../model/workspace.model';

/**
 * Abstract work space services
 */
export abstract class WorkSpacesService {

/**
 * Create a workspace for given codebase ID
 *
 * @param codeBaseId The ID associated with the given workspace
 * @returns {Observable<WorkspaceLinks>}
 */
abstract createWorkSpace(codeBaseId: string): Observable<WorkspaceLinks>;
}
