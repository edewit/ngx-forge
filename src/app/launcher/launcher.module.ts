import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepIndicatorComponent } from './step-indicator/step-indicator.component';
import { WizardComponent } from './wizard.component';
import { InViewportModule } from '@thisissoon/angular-inviewport';
import { MissionRuntimeStepComponent } from './mission-runtime-step/mission-runtime-step.component';
import { TargetEnvironmentStepComponent } from './targetenvironment-step/target-environment-step.component';
import { GitProviderStepComponent } from './gitprovider-step/gitprovider-step.component';
import { ReleaseStrategyStepComponent } from './release-strategy-step/release-strategy-step.component';
import { ProjectSummaryStepComponent } from './project-summary-step/project-summary-step.component';
import { ActivateBoosterStepComponent } from './activate-booster-step/activate-booster-step.component';
import { NewProjectStepComponent } from './new-project-step/new-project-step.component';
import { MissionRuntimeService } from './service/mission-runtime.service';
import { BsDropdownModule } from 'ngx-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    InViewportModule,
    BsDropdownModule.forRoot()
  ],
  exports: [
    WizardComponent
  ],
  declarations: [
    StepIndicatorComponent,
    WizardComponent,
    MissionRuntimeStepComponent,
    TargetEnvironmentStepComponent,
    ReleaseStrategyStepComponent,
    GitProviderStepComponent,
    ProjectSummaryStepComponent,
    ActivateBoosterStepComponent,
    NewProjectStepComponent
  ]
})
export class LauncherModule {
  constructor() {}
}

export { MissionRuntimeService } from './service/mission-runtime.service';
export { PipelineService } from './service/pipeline.service';
export { Mission } from './model/mission.model';
export { Runtime } from './model/runtime.model';
export { Pipeline } from './model/pipeline.model';
