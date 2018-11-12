export class Capability {
  module: string;
  name: string;
  description: string;
  icon?: string;
  props: Property[];
}

export class Property {
  id;
  values?;
  shared?: boolean;
}

export class SelectedCapability {
  capabilities: any[] = [];
}
