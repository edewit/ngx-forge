import { ReviewComponent } from '../../review.component';
import { Component } from '@angular/core';
import { Broadcaster } from 'ngx-base';

@Component({
  templateUrl: './release-strategy-createapp-review.component.html'
})
export class ReleaseStrategyCreateappReviewComponent implements ReviewComponent {
  data: any;

  constructor(private broadcaster: Broadcaster) { }

  navToStep(id: string) {
    this.broadcaster.broadcast('navigation', id);
  }
}
