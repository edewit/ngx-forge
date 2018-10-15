import { Component } from '@angular/core';

@Component({
  template: `
    <div style="margin-top:48px">
      <img src="/assets/dummy-pipeline-page.png" alt="screenshot of the pipeline page">
      <a class="btn btn-danger btn-lg" [routerLink]="['/']">Back</a>
    </div>
  `
})
export class PipelineDemoComponent { }
