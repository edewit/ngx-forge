import { Component } from '@angular/core';
import { Broadcaster } from 'ngx-base';
import { Projectile } from '../../model/projectile.model';
import { ReviewComponent } from '../../review.component';

@Component({
  selector: 'f8launcher-dependency-editor-review',
  templateUrl: './dependency-editor-review.component.html'
})
export class DependencyEditorReviewComponent extends ReviewComponent {

  constructor(broadcaster: Broadcaster, projectile: Projectile<any>) {
    super(broadcaster, projectile);
  }
}
