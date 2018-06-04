import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import { Catalog, CatalogRuntime } from '../model/catalog.model';
import { Booster, BoosterRuntime, BoosterVersion } from '../model/booster.model';

export class BoosterSelection {
  empty: boolean;
  emptyReason?: string;
  boosters: Booster[];
}

/**
 * Abstract mission runtime service provided to ensure consumer implements this pattern
 */
export abstract class MissionRuntimeService {

  static getAvailableBoosters(boosters: Booster[],
                              cluster?: string,
                              missionId?: string,
                              runtimeId?: string,
                              versionId?: string): BoosterSelection {
    const availableBoosters = boosters.filter(b => {
      return (!missionId || b.mission.id === missionId)
        && (!runtimeId || b.runtime.id === runtimeId)
        && (!versionId || b.version.id === versionId);
    });
    if (availableBoosters.length === 0) {
      return { empty: true, emptyReason: 'not-implemented', boosters: [] };
    }
    if (!cluster) {
      return { empty: false, boosters: availableBoosters };
    }
    const boostersRunningOnCluster = boosters.filter(b => MissionRuntimeService.checkRunsOnCluster(b, cluster));
    if (boostersRunningOnCluster.length === 0) {
      return { empty: true, emptyReason: 'unavailable-on-cluster', boosters: [] };
    }
    return { empty: false, boosters: boostersRunningOnCluster };
  }

  private static checkRunsOnCluster(booster: Booster, cluster: string) {
    let defaultResult = true;
    let runsOn = _.get(booster, 'metadata.app.launcher.runsOn');
    if (typeof runsOn === 'string') {
      runsOn = [runsOn];
    }
    if (runsOn && runsOn.length !== 0) {
      for (let i = 0; i < runsOn.length; i++) {
        let supportedCategory = runsOn[i];
        if (!supportedCategory.startsWith('!')) {
          defaultResult = false;
        }
        if (supportedCategory.toLowerCase() === 'all'
          || supportedCategory.toLowerCase() === '*'
          || supportedCategory.toLocaleLowerCase() === cluster) {
          return true;
        } else if (supportedCategory.toLowerCase() === 'none'
          || supportedCategory.toLowerCase() === '!*'
          || supportedCategory.toLowerCase() === ('!' + cluster)) {
          return false;
        }
      }
    }
    return defaultResult;
  }

  private static createBoosters(catalog: Catalog): Booster[] {
    const missionById = _.keyBy(catalog.missions, 'id');
    const runtimeById = _.keyBy(catalog.runtimes, 'id');
    return catalog.boosters.map(b => {
      const runtime: CatalogRuntime = runtimeById[b.runtime];
      return {
        name: b.name,
        description: b.description,
        metadata: b.metadata,
        mission: missionById[b.mission],
        runtime: runtime,
        version: runtime.versions.find(v => v.id === b.version)
      };
    });
  }

  getBoosters(): Observable<Booster[]> {
    return this.getCatalog()
      .map(c => MissionRuntimeService.createBoosters(c));
  }

  getDefaultVersion(runtime: BoosterRuntime, versions: BoosterVersion[]): BoosterVersion {
    return versions[0];
  }

  abstract getCatalog(): Observable<Catalog>;

}
