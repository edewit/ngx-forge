export class BoosterVersion {
  id: string;
  name: string;
}

export class BoosterRuntime {
  id: string;
  name: string;
  description?: string;
  icon: string;
  metadata: any;
}

export class BoosterMission {
  id: string;
  name: string;
  description?: string;
  metadata: any;
}

export class Booster {
  name: string;
  description?: string;
  metadata: any;
  mission: BoosterMission;
  runtime: BoosterRuntime;
  version: BoosterVersion;
}
