import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { TokenService } from '../../app/launcher/service/token.service';
import { Cluster } from '../../app/launcher/model/cluster.model';

const mockClusters = require('../../assets/mock/demo-token.json');
@Injectable()
export class DemoTokenService implements TokenService {

  get clusters(): Observable<Cluster[]> {
    return Observable.of(mockClusters)
      .delay(2000);
  }

  createOathLink(cluster: string): string {
    return `oath-link?${cluster}`;
  }
}
