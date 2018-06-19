import { Injectable } from '@angular/core';

import { MissionRuntimeService } from '../../app/launcher/launcher.module';
import { Observable} from 'rxjs/Observable';
import { Catalog, CatalogBooster } from '../../app/launcher/model/catalog.model';

const osioMockData = require('../../assets/mock/demo-catalog-osio.json') as Catalog;
const launchMockData = require('../../assets/mock/demo-catalog-launch.json') as Catalog;


@Injectable()
export class DemoMissionRuntimeService extends MissionRuntimeService {

  getCatalog(): Observable<Catalog> {
    const isLauncher = location.href.indexOf('launcher') !== -1;
    if (isLauncher) {
      return Observable.of(launchMockData);
    }
    let mock = osioMockData;
    let blank = {
      description: 'This is a blank mission',
      id: 'blank-mission',
      metadata: {},
      name: 'Blank Mission'
    };
    mock.missions.push(blank);

    mock.runtimes.forEach(function(r) {
      let run = <CatalogBooster>{
        description: 'Blank mission flow',
        metadata: null,
        mission: 'blank-mission',
        runtime: r.id,
        version: 'community'
        };
      mock.boosters.push(run);
    });
    return Observable.of(osioMockData);
  }

}
