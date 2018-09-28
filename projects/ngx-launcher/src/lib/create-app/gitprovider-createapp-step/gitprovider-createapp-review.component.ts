import { ReviewComponent } from '../../review.component';
import { Component, Input } from '@angular/core';
import { Broadcaster } from 'ngx-base';
import { Projectile } from '../../model/summary.model';

@Component({
  selector: 'f8launcher-gitprovider-createapp-review',
  templateUrl: './gitprovider-createapp-review.component.html',
})
export class GitproviderCreateappReviewComponent extends ReviewComponent {
  constructor(broadcaster: Broadcaster, projectile: Projectile<any>) {
    super(broadcaster, projectile);
  }
}
