import { ReviewComponent } from '../../review.component';
import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Broadcaster } from 'ngx-base';
import { Projectile } from '../../model/projectile.model';

@Component({
  selector: 'f8launcher-mission-runtime-createapp-review',
  templateUrl: './mission-runtime-createapp-review.component.html'
})
export class MissionRuntimeCreateappReviewComponent extends ReviewComponent {

  constructor(public _DomSanitizer: DomSanitizer, broadcaster: Broadcaster, projectile: Projectile<any>) {
    super(broadcaster, projectile);
  }
}
