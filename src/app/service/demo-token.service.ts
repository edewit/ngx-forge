import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Cluster } from '../../../projects/ngx-launcher/src/lib/model/cluster.model';
import { TokenService } from '../../../projects/ngx-launcher/src/lib/service/token.service';

const mockClusters = require('../mock/demo-token.json');
@Injectable()
export class DemoTokenService implements TokenService {

  get clusters(): Observable<Cluster[]> {
    return of(mockClusters).pipe(
      delay(2000)
     );
  }

  createOathLink(cluster: string): string {
    return `oath-link?${cluster}`;
  }
}
