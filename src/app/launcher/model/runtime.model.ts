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
  version?: {
    id: string;
    name: string;
  }; // Menu selection
  url?: string;
  projectVersion?: string;
  pipelinePlatform?: string;
}
