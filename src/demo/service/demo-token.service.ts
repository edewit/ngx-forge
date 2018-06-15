import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { TokenService } from '../../app/launcher/service/token.service';
import { Cluster } from '../../app/launcher/model/cluster.model';

const MockClusters = require('../../assets/mock/demo-token.json');
@Injectable()
export class DemoTokenService implements TokenService {

  get clusters(): Observable<Cluster[]> {
    return Observable.of(MockClusters);
  }

  createOathLink(cluster: string): string {
    return `oath-link?${cluster}`;
  }
}
