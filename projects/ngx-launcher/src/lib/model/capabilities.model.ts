export class Capability {
  module: string;
  name: string;
  description: string;
  icon?: string;
  props: Property[];
  metadata: any;
}

export class Property {
  id;
  values?;
  shared?: boolean;
}

export class SelectedCapability {
  capabilities: Map<string, any> = new Map<string, any>();

  get values(): any[] {
    return Array.from(this.capabilities.values());
  }

  set values(values: any[]) {
    for (const value of values) {
      this.capabilities.set(value['module'], value);
    }
  }
}
