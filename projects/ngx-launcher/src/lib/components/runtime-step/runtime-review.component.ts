import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Broadcaster } from 'ngx-base';

import { Projectile } from '../../model/projectile.model';
import { ReviewComponent } from '../../review.component';

@Component({
  selector: 'f8launcher-runtime-review',
  templateUrl: './runtime-review.component.html'
})
export class RuntimeReviewComponent extends ReviewComponent {
  constructor(broadcaster: Broadcaster, public _DomSanitizer: DomSanitizer, projectile: Projectile<any>) {
    super(broadcaster, projectile);
  }
}
