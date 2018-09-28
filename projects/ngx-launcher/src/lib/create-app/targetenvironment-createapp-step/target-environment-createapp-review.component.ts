import { Component, OnInit } from '@angular/core';
import { Broadcaster } from 'ngx-base';
import { Projectile } from '../../model/summary.model';
import { ReviewComponent } from '../../review.component';

@Component({
  selector: 'f8launcher-target-environment-createapp-review',
  templateUrl: './target-environment-createapp-review.component.html'
})
export class TargetEnvironmentCreateappReviewComponent extends ReviewComponent implements OnInit {
  constructor(broadcaster: Broadcaster, projectile: Projectile<any>) {
    super(broadcaster, projectile);
  }
}
