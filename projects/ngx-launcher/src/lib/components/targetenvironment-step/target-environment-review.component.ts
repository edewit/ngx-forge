import { Component, OnInit } from '@angular/core';
import { Broadcaster } from 'ngx-base';
import { Projectile } from '../../model/projectile.model';
import { ReviewComponent } from '../../review.component';

@Component({
  selector: 'f8launcher-target-environment-review',
  templateUrl: './target-environment-review.component.html'
})
export class TargetEnvironmentReviewComponent extends ReviewComponent implements OnInit {
  constructor(broadcaster: Broadcaster, projectile: Projectile<any>) {
    super(broadcaster, projectile);
  }
}
