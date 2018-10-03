import { ReviewComponent } from '../../review.component';
import { Component } from '@angular/core';
import { Broadcaster } from 'ngx-base';
import { Projectile } from '../../model/summary.model';

@Component({
  selector: 'f8launcher-release-strategy-createapp-review',
  templateUrl: './release-strategy-createapp-review.component.html'
})
export class ReleaseStrategyCreateappReviewComponent extends ReviewComponent {
  constructor(broadcaster: Broadcaster, projectile: Projectile<any>) {
    super(broadcaster, projectile);
  }
}
