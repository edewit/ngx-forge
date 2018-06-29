import { EmptyReason, MissionRuntimeService } from './mission-runtime.service';
import { Observable } from 'rxjs/Observable';
import { Catalog, CatalogMission, CatalogRuntime } from '../model/catalog.model';
import { BoosterVersion } from '../model/booster.model';


export const createMission = (name: string) => ({
  id: name,
  name: name,
  description : `${name} sample desc`,
  metadata: {
    suggested: true,
    prerequisite: 'prerequisite text'
  }
} as CatalogMission);

export const createRuntime = (name: string, versions: string[]) => ({
  id: name,
  name: name,
  description : `${name} sample desc`,
  icon: 'data:image/svg+xml...',
  metadata: {
    suggested: true,
    prerequisite: 'prerequisite text'
  },
  versions: versions.map(v => ({ id: v, name: `${v} name` }))
} as CatalogRuntime);

export const createBooster = (mission: string, runtime: string, version: string) => ({
  mission: mission,
  runtime: runtime,
  version: version,
  name: `${mission}-${runtime}-${version}`,
  description: `${mission} ${runtime}  sample desc`
});


export class TestMissionRuntimeService extends MissionRuntimeService {

  public catalog: Catalog = {
    missions: [
      createMission('crud'),
      createMission('healthcheck'),
      createMission('rest')
    ],
    runtimes: [
      createRuntime('vert.x', ['community', 'redhat']),
      createRuntime('nodejs', ['community', 'redhat'])
    ],
    boosters: [
      createBooster('crud', 'vert.x', 'community'),
      createBooster('crud', 'vert.x', 'redhat'),
      createBooster('crud', 'nodejs', 'redhat'),
      createBooster('healthcheck', 'vert.x', 'community'),
      createBooster('rest', 'vert.x', 'community')
    ]
  };

  getCatalog(): Observable<Catalog> {
    return Observable.of(this.catalog);
  }
}

describe('MissionRuntimeService', () => {
  let service: TestMissionRuntimeService;

  beforeEach(() => {
    service = new TestMissionRuntimeService();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should create boosters correctly', () => {
    service.getBoosters().subscribe((boosters) => {
      expect(boosters).toBeTruthy();
      expect(boosters.length).toBe(5);
      expect(boosters[0].runtime).toBe(service.catalog.runtimes[0]);
      expect(boosters[0].mission).toBe(service.catalog.missions[0]);
      expect(boosters[0].version).toBe(service.catalog.runtimes[0].versions[0]);
    });
  });

  it('should fail when catalog is not consistent', () => {
    delete service.catalog.runtimes[0];
    const subscriber = {
      successHandler: () => {},
      errorHandler: () => {}
    };
    spyOn(subscriber, 'successHandler');
    spyOn(subscriber, 'errorHandler');
    service.getBoosters().subscribe(subscriber.successHandler, subscriber.errorHandler);
    expect(subscriber.successHandler).not.toHaveBeenCalled();
    const expectedError = new Error(`Invalid catalog booster: ${JSON.stringify(service.catalog.boosters[0])}`  );
    expect(subscriber.errorHandler).toHaveBeenCalledWith(expectedError);
  });

  it('should get available boosters be all boosters when nothing is selected', () => {
    service.getBoosters().subscribe((boosters) => {
      expect(MissionRuntimeService.getAvailableBoosters(boosters).boosters).toEqual(boosters);
    });
  });

  it('should get available boosters correctly for mission, runtime and version', () => {
    service.getBoosters().subscribe((boosters) => {
      const crudVertxCommunityBooster = boosters[0];
      const crudVertxRedHatBooster = boosters[1];
      const crudNodeRedHatBooster = boosters[2];
      const healthCheckBooster = boosters[3];
      expect(crudVertxCommunityBooster.name).toBe('crud-vert.x-community');
      expect(crudVertxRedHatBooster.name).toBe('crud-vert.x-redhat');
      expect(crudNodeRedHatBooster.name).toBe('crud-nodejs-redhat');
      expect(healthCheckBooster.name).toBe('healthcheck-vert.x-community');

      let crudBoosters = MissionRuntimeService.getAvailableBoosters(boosters, null, 'crud');
      expect(crudBoosters.boosters.length).toBe(3);
      expect(crudBoosters.boosters[0]).toBe(crudVertxCommunityBooster);
      expect(crudBoosters.boosters[1]).toBe(crudVertxRedHatBooster);
      expect(crudBoosters.boosters[2]).toBe(crudNodeRedHatBooster);

      let healthCheck = MissionRuntimeService.getAvailableBoosters(boosters, null, 'healthcheck');
      expect(healthCheck.boosters.length).toBe(1);
      expect(healthCheck.boosters[0]).toBe(healthCheckBooster);

      let crudVertxBoosters = MissionRuntimeService.getAvailableBoosters(boosters,
        null, 'crud', 'vert.x');
      expect(crudVertxBoosters.boosters.length).toBe(2);
      expect(crudVertxBoosters.boosters[0]).toBe(crudVertxCommunityBooster);
      expect(crudVertxBoosters.boosters[1]).toBe(crudVertxRedHatBooster);

      let crudVertxRedHatBoosters = MissionRuntimeService.getAvailableBoosters(boosters,
        null, 'crud', 'vert.x', 'redhat');
      expect(crudVertxRedHatBoosters.boosters.length).toBe(1);
      expect(crudVertxRedHatBoosters.boosters[0]).toBe(crudVertxRedHatBooster);
    });
  });

  it('should return empty with not-implemented reason when there is no booster for the specified ids', () => {
    service.getBoosters().subscribe((boosters) => {
      let healthCheckVertx = MissionRuntimeService.getAvailableBoosters(boosters,
        null, 'healthcheck', 'vertx');
      expect(healthCheckVertx.empty).toBeTruthy();
      expect(healthCheckVertx.emptyReason).toBe(EmptyReason.NOT_IMPLEMENTED);
    });
  });

  it('should return empty with cluster-incompatibility reason when there is no booster for the specified cluster',
    () => {
    service.getBoosters().subscribe((boosters) => {
      for (let i = 0; i < 3; i++) {
        boosters[i].metadata = { app: { launcher: { runsOn: '!starter' }}};
      }
      let crudStarterBooster = MissionRuntimeService.getAvailableBoosters(boosters, 'starter', 'crud');
      expect(crudStarterBooster.empty).toBeTruthy();
      expect(crudStarterBooster.emptyReason).toBe(EmptyReason.CLUSTER_INCOMPATIBILITY);
    });
  });

  it('should return the most compatible version',
    () => {
      service.getBoosters().subscribe((boosters) => {
        const communityVersion: BoosterVersion = { id: 'community', name: 'community name' };
        const redhatVersion: BoosterVersion = { id: 'redhat', name: 'redhat name' };
        const version = service.getDefaultVersion(
          'vert.x',
          [communityVersion, redhatVersion],
          boosters.filter((b) => b.runtime.id === 'vert.x')
        );
        expect(version).toBe(communityVersion);
      });
    });
});
