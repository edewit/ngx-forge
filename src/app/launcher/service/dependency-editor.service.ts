import { Observable } from 'rxjs';

import { DependencyCheck } from '../model/dependency-check.model';

/**
 * Abstract dependency service provided to ensure consumer implements this pattern
 */
export abstract class DependencyEditorService {
    /**
     * Abstract service to get information about the boosters selected by the user.
     * @param{string} - missionId
     * @param{string} - runtimeId
     * @returns{Observable<string>}
     */
    abstract getBoosterInfo(missionId: string, runtimeId: string, runtimeVersion: string): Observable<string>;
}
