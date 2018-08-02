import { Observable } from 'rxjs';

/**
 * Abstract dependency service provided to ensure consumer implements this pattern
 */
export abstract class DependencyEditorService {
    /**
     * Abstract service to get information about the boosters selected by the user.
     *
     * @param{string} - runtimeId
     * @returns{Observable<any>}
     */
    abstract getCoreDependencies(runtimeId: string): Observable<any>;
}
