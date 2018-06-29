import { Component, Optional, Output, EventEmitter, ChangeDetectorRef, Input } from '@angular/core';

import { Cluster } from '../../model/cluster.model';
import { TokenService } from '../../service/token.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'f8launcher-link-accounts-createapp-step',
  templateUrl: './link-accounts-createapp-step.component.html',
  styleUrls: ['./link-accounts-createapp-step.component.less']
})
export class LinkAccountsCreateappStepComponent {
  @Output() select = new EventEmitter(true);

  private _clusters: Cluster[] = [];
  private clusterId: string;


  constructor(@Optional() private tokenService: TokenService, private changeDetector: ChangeDetectorRef) {
  }

  selectCluster(cluster: Cluster): void {
    this.clusterId = cluster.id;
    this.select.emit(cluster);
  }

  get clusters(): Cluster[] {
    return this._clusters;
  }

  @Input()
  set clusters(clusters: Cluster[]) {
    this._clusters = clusters;
    this.autoSetCluster();
  }

  private autoSetCluster(): void {
    const connectedClusters = this.clusters.filter(c => c.connected);
    if (connectedClusters.length === 1) {
      this.selectCluster(connectedClusters[0]);
      this.changeDetector.detectChanges();
    }
  }
}
