import { ChangeDetectorRef, Component, EventEmitter, Input, Optional, Output } from '@angular/core';

import { Cluster } from '../../model/cluster.model';
import { TokenService } from '../../service/token.service';

@Component({
  selector: 'f8launcher-link-accounts-step',
  templateUrl: './link-accounts-step.component.html',
  styleUrls: ['./link-accounts-step.component.less']
})
export class LinkAccountsStepComponent {
  @Output() select = new EventEmitter(true);

  private _clusters: Cluster[] = [];
  clusterId: string;


  constructor(@Optional() public tokenService: TokenService, private changeDetector: ChangeDetectorRef) {
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
