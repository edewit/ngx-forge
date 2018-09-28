import { Cluster } from './cluster.model';
import { DependencyCheck } from './dependency-check.model';

export class TargetEnvironment {
  description: string;
  benefits: string[];
  footer: string;
  header: string;
  icon: string;
  id: string;
  styleClass: string;
}

export class TargetEnvironmentSelection {
  cluster: Cluster;
  dependencyCheck: DependencyCheck;
}
