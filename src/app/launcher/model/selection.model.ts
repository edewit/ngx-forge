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
  platform?: string;
  spacePath?: string;
  targetEnvironment?: string;
}
