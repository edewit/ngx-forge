import { Cluster } from './cluster.model';
import { DependencyCheck } from './dependency-check.model';
import { DependencySnapshotItem } from './dependency-snapshot-item.model';
import { GitHubDetails } from './github-details.model';
import { Mission } from './mission.model';
import { Runtime } from './runtime.model';
import { Pipeline } from './pipeline.model';

export class Summary {
  cluster?: Cluster;
  dependencyCheck: DependencyCheck;
  dependencySnapshot: any;
  gitHubDetails?: GitHubDetails;
  mission: Mission;
  organization: string;
  pipeline: Pipeline;
  runtime: Runtime;
  targetEnvironment: string;
}
