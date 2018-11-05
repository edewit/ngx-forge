import { Runtime } from './runtime.model';

export class Capability {
  module: string;
  name: string;
  description: string;
  icon?: string;
  props: {
    runtime?: {
      values: [Runtime];
    }
  };
}

export class SelectedCapability {
  capabilities: any[] = [];
}
