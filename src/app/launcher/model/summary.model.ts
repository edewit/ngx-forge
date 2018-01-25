import { Mission } from './mission.model';
import { Runtime } from './runtime.model';
import { Pipeline } from './pipeline.model';

export class Summary {
  mission: Mission;
  runtime: Runtime;
  runtimeVersion: string;
  targetEnvironment: string;
  clusterId?: string;
  pipeline: Pipeline;
  projectName: string;
  mavenArtifact: string;
  projectVersion: string;
  groupId: string;
  spacePath?: string;
  organization: string;
  repository: string;
}
