import { DependencySnapshotItem } from './dependency-snapshot-item.model';
export class DependencyCheck {
  groupId: string;
  mavenArtifact: string;
  projectName: string;
  projectVersion: string;
  spacePath: string;
  dependencySnapshot: DependencySnapshotItem;
}
