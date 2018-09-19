import { Component } from '@angular/core';
import { Broadcaster } from 'ngx-base';
import { ReviewComponent } from '../../review.component';

@Component({
  templateUrl: './target-environment-createapp-review.component.html'
})
export class TargetEnvironmentCreateappReviewComponent implements ReviewComponent {
  data: any;

  constructor(private broadcaster: Broadcaster) {}

  navToStep(id: string) {
    this.broadcaster.broadcast('navigation', id);
  }
}
