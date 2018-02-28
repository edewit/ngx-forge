export class Runtime {
  description: string;
  icon: string;
  id: string;
  missions: [{
    id: string;
    versions: [{
      id: string;
      name: string;
    }]
  }];
  name: string;
  projectVersion?: string;
  pipelinePlatform?: string;
  prerequisite?: string;
  suggested?: boolean;
  version?: {
    id: string;
    name: string;
  }; // Menu selection
  url?: string;
}
