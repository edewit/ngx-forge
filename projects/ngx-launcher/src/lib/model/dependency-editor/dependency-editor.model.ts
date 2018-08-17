import { DependencySnapshotItem } from './dependency-snapshot-item.model';
export class DependencyEditor {
    groupId: string;
    mavenArtifact: string;
    projectName: string;
    projectVersion: string;
    spacePath: string;
    dependencySnapshot: Array<DependencySnapshotItem>;
}
