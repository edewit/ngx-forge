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
