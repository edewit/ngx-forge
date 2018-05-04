import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { Observable } from "rxjs";

import { TokenService } from "../../app/launcher/service/token.service";
import { HelperService } from '../../app/launcher/service/helper.service';
import { TokenProvider } from '../../app/service/token-provider';
import { Cluster } from '../../app/launcher/model/cluster.model';

@Injectable()
export class DemoTokenService implements TokenService {

  get availableClusters(): Observable<Cluster[]> {
    return Observable.of([
      {
        "id": "starter-ca-central-1",
        "type": "starter"
      },
      {
        "id": "starter-us-west-1",
        "type": "starter"
      }
    ]);
  };

  get clusters(): Observable<Cluster[]> {
    return Observable.of([
      {
        "id": "starter-us-east-1",
        "type": "starter"
      },
      {
        "id": "starter-us-west-1",
        "type": "starter"
      },
      {
        "id": "starter-us-west-2",
        "type": "starter"
      },
      {
        "id": "starter-ca-central-1",
        "type": "starter"
      },
      {
        "id": "pro-us-east-1",
        "type": "pro"
      },
      {
        "id": "pro-eu-west-1",
        "type": "pro"
      },
      {
        "id": "pro-ap-southeast-2",
        "type": "pro"
      },
      {
        "id": "online-stg",
        "type": "internal"
      }
    ]);
  }

  createOathLink(cluster: string): string {
    return "oath-link?" + cluster;
  }
}
