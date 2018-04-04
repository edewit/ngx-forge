import { Cluster } from "./cluster.model";

export class Selection {
  groupId?: string;
  missionId?: string;
  pipelineId?: string;
  projectName?: string;
  projectVersion?: string;
  runtimeId?: string;
  runtimeVersion?: {
    id: string;
    name: string;
  };
  spacePath?: string;
  targetEnvironment?: string;
  cluster?: Cluster;
}
