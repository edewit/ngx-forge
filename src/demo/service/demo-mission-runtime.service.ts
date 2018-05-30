import { Injectable } from '@angular/core';

import { MissionRuntimeService } from '../../app/launcher/launcher.module';
import { Observable} from 'rxjs/Observable';
import { Catalog } from '../../app/launcher/model/catalog.model';

const osioMockData = require('../../assets/mock/demo-catalog-osio.json') as Catalog;
const launchMockData = require('../../assets/mock/demo-catalog-launch.json') as Catalog;


@Injectable()
export class DemoMissionRuntimeService extends MissionRuntimeService {

  getCatalog(): Observable<Catalog> {
    const isLauncher = location.href.indexOf('launcher') !== -1;
    if (isLauncher) {
      return Observable.of(launchMockData);
    }
    return Observable.of(osioMockData);
  }

}
