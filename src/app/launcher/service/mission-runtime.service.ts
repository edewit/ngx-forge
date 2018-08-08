import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import { Catalog, CatalogMission, CatalogRuntime } from '../model/catalog.model';
import { Booster, BoosterVersion } from '../model/booster.model';


export enum EmptyReason {
  NOT_IMPLEMENTED,
  CLUSTER_INCOMPATIBILITY
}

export class AvailableBoosters {
  empty: boolean;
  emptyReason?: EmptyReason;
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
                              versionId?: string): AvailableBoosters {
    const availableBoosters = boosters.filter(b => {
      return (!missionId || b.mission.id === missionId)
        && (!runtimeId || b.runtime.id === runtimeId)
        && (!versionId || b.runtime.versions.filter((v: BoosterVersion) => v.id === versionId).length > 0);
    });
    if (availableBoosters.length === 0) {
      return { empty: true, emptyReason: EmptyReason.NOT_IMPLEMENTED, boosters: [] };
    }
    if (!cluster) {
      return { empty: false, boosters: availableBoosters };
    }
    const boostersRunningOnCluster = availableBoosters.filter(b => {
      return MissionRuntimeService.checkRunsOnCluster(b, cluster);
    });
    if (boostersRunningOnCluster.length === 0) {
      return { empty: true, emptyReason: EmptyReason.CLUSTER_INCOMPATIBILITY, boosters: [] };
    }
    return { empty: false, boosters: boostersRunningOnCluster };
  }

  static compareVersions(a: BoosterVersion, b: BoosterVersion): number {
    const aSuggested: boolean = _.get(a, 'metadata.suggested', false);
    const bSuggested: boolean = _.get(b, 'metadata.suggested', false);
    if (aSuggested !== bSuggested) {
      return aSuggested ? -1 : 1;
    }
    // TODO remove this 'community' hook mainteners should use suggested field
    const aCommunity = a.id.indexOf('community') >= 0;
    const bCommunity = b.id.indexOf('community') >= 0;
    if (aCommunity !== bCommunity) {
      return aCommunity ? -1 : 1;
    }
    return -1 * a.id.localeCompare(b.id);
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
      const mission: CatalogMission = missionById[b.mission];
      const version = runtime && runtime.versions.find(v => v.id === b.version);
      if (!mission || !runtime || !version) {
        throw new Error(`Invalid catalog booster: ${JSON.stringify(b)}`  );
      }
      return {
        name: b.name,
        description: b.description,
        metadata: b.metadata,
        mission: mission,
        runtime: runtime,
        source: b.source,
        version: version
      };
    });
  }

  getBoosters(): Observable<Booster[]> {
    return this.getCatalog()
      .map(c => MissionRuntimeService.createBoosters(c))
      ;
  }

  abstract getCatalog(): Observable<Catalog>;

}
