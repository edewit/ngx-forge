export class BoosterVersion {
  id: string;
  name: string;
  metadata?: any;
}

export class BoosterRuntime {
  id: string;
  name: string;
  description?: string;
  metadata?: any;
  icon: string;
  versions?: BoosterVersion[];
}

export class BoosterMission {
  id: string;
  name: string;
  description?: string;
  metadata?: any;
}

export class Booster {
  name: string;
  description?: string;
  metadata?: any;
  mission: BoosterMission;
  runtime: BoosterRuntime;
  version: BoosterVersion;
}
