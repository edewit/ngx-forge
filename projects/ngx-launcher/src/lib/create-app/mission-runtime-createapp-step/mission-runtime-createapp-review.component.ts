import { ReviewComponent } from '../../review.component';
import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  templateUrl: './mission-runtime-createapp-review.component.html'
})
export class MissionRuntimeCreateappReviewComponent implements ReviewComponent {
  data: any;

  constructor(public _DomSanitizer: DomSanitizer) {}
}
