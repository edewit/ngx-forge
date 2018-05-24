import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {TokenService} from '../../app/launcher/service/token.service';
import {Cluster} from '../../app/launcher/model/cluster.model';

@Injectable()
export class DemoTokenService implements TokenService {

  get clusters(): Observable<Cluster[]> {
    return Observable.of([
      {
        'id': 'starter-us-east-1',
        'type': 'starter',
        'connected': true
      },
      {
        'id': 'starter-us-west-1',
        'type': 'starter',
        'connected': false
      },
      {
        'id': 'starter-us-west-2',
        'type': 'starter',
        'connected': false
      },
      {
        'id': 'starter-ca-central-1',
        'type': 'starter',
        'connected': false
      },
      {
        'id': 'pro-us-east-1',
        'type': 'pro',
        'connected': false
      },
      {
        'id': 'pro-eu-west-1',
        'type': 'pro',
        'connected': false
      },
      {
        'id': 'pro-ap-southeast-2',
        'type': 'pro',
        'connected': false
      },
      {
        'id': 'online-stg',
        'type': 'internal',
        'connected': false
      }
    ]);
  }

  createOathLink(cluster: string): string {
    return `oath-link?${cluster}`;
  }
}
