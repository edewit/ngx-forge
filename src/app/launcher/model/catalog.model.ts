
export class CatalogMission {
  id: string;
  name: string;
  description: string;
  metadata?: any;
}

export class CatalogRuntimeVersion {
  id: string;
  name: string;
  metadata?: any;
}

export class CatalogRuntime {
  id: string;
  name: string;
  description?: string;
  icon: string;
  metadata?: any;
  versions: CatalogRuntimeVersion[];
}

export class CatalogBooster {
  mission: string;
  runtime: string;
  version: string;
  name: string;
  description?: string;
  metadata?: any;
  source?: any;
}

export class Catalog {
  missions: CatalogMission[];
  runtimes: CatalogRuntime[];
  boosters: CatalogBooster[];
}
