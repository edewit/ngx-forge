import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Catalog, CatalogBooster } from '../../../projects/ngx-launcher/src/lib/model/catalog.model';
import { MissionRuntimeService } from '../../../projects/ngx-launcher/src/lib/service/mission-runtime.service';

const osioMockData = require('../mock/demo-catalog-osio.json') as Catalog;
const launchMockData = require('../mock/demo-catalog-launch.json') as Catalog;


@Injectable()
export class DemoMissionRuntimeService extends MissionRuntimeService {

  getCatalog(): Observable<Catalog> {
    const isLauncher = location.href.indexOf('launcher') !== -1;
    if (isLauncher) {
      return of(launchMockData);
    }
    const mock = osioMockData;
    const blank = {
      description: 'This is a blank mission',
      id: 'blank-mission',
      metadata: {},
      name: 'Blank Mission'
    };
    mock.missions.push(blank);

    mock.runtimes.forEach((r) => {
      r.versions.forEach((v) => {
        const run = <CatalogBooster> {
          name: 'Blank Mission',
          description: 'Blank mission flow',
          metadata: null,
          mission: 'blank-mission',
          runtime: r.id,
          version: v.id
        };
        mock.boosters.push(run);
      });
    });
    return of(osioMockData);
  }

}
