import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Catalog } from '../../../projects/ngx-launcher/src/lib/model/catalog.model';
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
    return of(osioMockData);
  }
}
