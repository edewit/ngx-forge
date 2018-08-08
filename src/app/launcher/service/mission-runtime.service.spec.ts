import { EmptyReason, MissionRuntimeService } from './mission-runtime.service';
import { Observable } from 'rxjs/Observable';
import { Catalog, CatalogBooster, CatalogMission, CatalogRuntime, CatalogRuntimeVersion } from '../model/catalog.model';
import { BoosterVersion } from '../model/booster.model';

export const createMission = (name: string): CatalogMission => ({
  id: name,
  name: name,
  description : `${name} sample desc`,
  metadata: {
    suggested: true,
    prerequisite: 'prerequisite text'
  }
});

export const createVersion = (id: string, suggested: boolean = false): BoosterVersion => ({
  id: id,
  name: `${id} name`,
  metadata: { suggested }
});

export const createRuntime = (name: string, versions: string[]): CatalogRuntime => ({
  id: name,
  name: name,
  description : `${name} sample desc`,
  icon: 'data:image/svg+xml...',
  metadata: {
    suggested: true,
    prerequisite: 'prerequisite text'
  },
  versions: versions.map(version => createVersion(version)) as CatalogRuntimeVersion[]
});

export const createBooster = (mission: string, runtime: string, version: string): CatalogBooster => ({
  mission: mission,
  runtime: runtime,
  version: version,
  name: `${mission}-${runtime}-${version}`,
  description: `${mission} ${runtime}  sample desc`
});


class TestMissionRuntimeService extends MissionRuntimeService {

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

  it('should sort versions as expected',
    () => {
      const versions: BoosterVersion[] = [
        createVersion('v01-community', false),
        createVersion('v00-community', true),
        createVersion('v01-redhat', false),
        createVersion('v02-redhat', false),
        createVersion('v02-community', false),
        createVersion('v03-community', false),
        createVersion('v03-redhat', true),
        createVersion('v05-community', true)
      ];
      const sorted = versions.sort(MissionRuntimeService.compareVersions);
      const expected: BoosterVersion[] = [
        createVersion('v05-community', true),
        createVersion('v00-community', true),
        createVersion('v03-redhat', true),
        createVersion('v03-community', false),
        createVersion('v02-community', false),
        createVersion('v01-community', false),
        createVersion('v02-redhat', false),
        createVersion('v01-redhat', false)
      ];
      for (let i = 0; i < versions.length; i++) {
        expect(sorted[i]).toEqual(expected[i]);
      }
    });
});
