import { Cluster } from './cluster.model';
import { DependencyCheck } from './dependency-check.model';
import { GitHubDetails } from './github-details.model';
import { Mission } from './mission.model';
import { Runtime } from './runtime.model';
import { Pipeline } from './pipeline.model';
import { DependencyEditor } from './dependency-editor/dependency-editor.model';

export class Summary {
  cluster?: Cluster;
  dependencyCheck: DependencyCheck;
  dependencyEditor?: DependencyEditor;
  gitHubDetails?: GitHubDetails;
  mission: Mission;
  organization: string;
  pipeline: Pipeline;
  runtime: Runtime;
  targetEnvironment: string;
}
