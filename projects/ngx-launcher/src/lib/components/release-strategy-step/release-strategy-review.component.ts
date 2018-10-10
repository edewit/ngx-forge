import { Component } from '@angular/core';
import { Broadcaster } from 'ngx-base';
import { Projectile } from '../../model/projectile.model';
import { ReviewComponent } from '../../review.component';

@Component({
  selector: 'f8launcher-release-strategy-review',
  templateUrl: './release-strategy-review.component.html'
})
export class ReleaseStrategyReviewComponent extends ReviewComponent {
  constructor(broadcaster: Broadcaster, projectile: Projectile<any>) {
    super(broadcaster, projectile);
  }
}
