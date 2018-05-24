import { Component, Optional, Output, EventEmitter } from '@angular/core';

import { Cluster } from '../../model/cluster.model';
import { TokenService } from '../../service/token.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'f8launcher-link-accounts-createapp-step',
  templateUrl: './link-accounts-createapp-step.component.html',
  styleUrls: ['./link-accounts-createapp-step.component.less']
})



export class LinkAccountsCreateappStepComponent {
  @Output() select = new EventEmitter();
  private _clusters: Cluster[] = [];
  private clusterId: string;

  constructor(@Optional() private tokenService: TokenService) {
    this.load();
  }

  selectCluster(cluster: Cluster): void {
    this.clusterId = cluster.id;
    this.select.emit(cluster);
  }

  get clusters(): Cluster[] {
    return this._clusters;
  }

  private load() {
    if (this.tokenService) {
      this.tokenService.clusters.subscribe(clusters => {
        this._clusters = clusters.sort(this.clusterSortFn);
        const connectedClusters = this._clusters.filter(c => c.connected);
        if (connectedClusters.length === 1) {
          this.selectCluster(connectedClusters[0]);
        }
      });
    }
  }

  private clusterSortFn(a: Cluster, b: Cluster): number {
    if (a.connected) {
      return -1;
    }
    return a.id.localeCompare(b.id);
  }
}
