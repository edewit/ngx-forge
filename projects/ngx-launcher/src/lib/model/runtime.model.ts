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

export interface Enums {
  [key: string]: Enum[];
}

export interface Enum {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  metadata?: object;
}
