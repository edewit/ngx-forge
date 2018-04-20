import { Component, Optional } from '@angular/core';

import { Cluster } from '../../model/cluster.model';
import { TokenService } from '../../service/token.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'f8launcher-link-accounts-createapp-step',
  templateUrl: './link-accounts-createapp-step.component.html',
  styleUrls: ['./link-accounts-createapp-step.component.less']
})
export class LinkAccountsCreateappStepComponent {

  availableClusters: Cluster[] = [];
  clusters: Cluster[] = [];

  constructor(@Optional() private tokenService: TokenService) {
    if (tokenService) {
      tokenService.clusters.subscribe(clusters => this.clusters = clusters);
      tokenService.availableClusters.subscribe(clusters => this.availableClusters = clusters);
    }
  }

  isChecked(token: Cluster): boolean {
    return this.availableClusters.map(cluster => cluster.id).indexOf(token.id) !== -1;
  }
}
