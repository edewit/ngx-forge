export class Runtime {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  pipelinePlatform?: string;
  version?: {
    id: string;
    name: string
  };
}
