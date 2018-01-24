import { Component, Host, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { WizardComponent } from '../wizard.component';
import { PipelineService } from '../service/pipeline.service';
import { Pipeline } from '../model/pipeline.model';
import { Subscription } from 'rxjs/Subscription';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8launcher-releasestrategy-step',
  templateUrl: './release-strategy-step.component.html',
  styleUrls: ['./release-strategy-step.component.less']
})
export class ReleaseStrategyStepComponent implements OnInit, OnDestroy{
  public pipelines: Pipeline[];
  private subscriptions: Subscription[] = [];

  constructor(@Host() public wizardComponent: WizardComponent,
              private pipelineService: PipelineService) {
  }

  ngOnInit() {
    let pipelineSubscription = this.pipelineService.getPipelines().subscribe((result) => {
      this.pipelines = result;
    });
    this.subscriptions.push(pipelineSubscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
