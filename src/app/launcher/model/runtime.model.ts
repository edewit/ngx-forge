export class Runtime {
  description?: string;
  metadata?: any;
  icon: string;
  id: string;
  missions: [{
    id: string;
    versions: [{
      booster?: {
        metadata: {
          runsOn: string[];
        }
      },
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
  showMore?: boolean;
}
