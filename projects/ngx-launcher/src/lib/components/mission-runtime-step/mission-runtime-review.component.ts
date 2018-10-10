import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Broadcaster } from 'ngx-base';
import { Projectile } from '../../model/projectile.model';
import { ReviewComponent } from '../../review.component';

@Component({
  selector: 'f8launcher-mission-runtime-review',
  templateUrl: './mission-runtime-review.component.html'
})
export class MissionRuntimeReviewComponent extends ReviewComponent {

  constructor(public _DomSanitizer: DomSanitizer, broadcaster: Broadcaster, projectile: Projectile<any>) {
    super(broadcaster, projectile);
  }
}
