import { NgModule, Provider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap';
import { ToolbarModule } from 'patternfly-ng';

// Note: This has to be imported first
import { StepIndicatorComponent } from './step-indicator/step-indicator.component';

import { ActivateBoosterComponent } from './activate-booster/activate-booster.component';
import { GitProviderStepComponent } from './gitprovider-step/gitprovider-step.component';
import { InViewportModule, WindowRef } from '@thisissoon/angular-inviewport';
import { MissionRuntimeService } from './service/mission-runtime.service';
import { MissionRuntimeStepComponent } from './mission-runtime-step/mission-runtime-step.component';
import { ProjectProgressComponent } from './project-progress/project-progress.component';
import { ProjectProgressService } from './service/project-progress.service';
import { ProjectSummaryStepComponent } from './project-summary-step/project-summary-step.component';
import { ReleaseStrategyStepComponent } from './release-strategy-step/release-strategy-step.component';
import { TargetEnvironmentStepComponent } from './targetenvironment-step/target-environment-step.component';
import { WizardComponent } from './wizard.component';

// Provide window object so as to not break SSR if using universal
export const providers: Provider[] = [
  { provide: WindowRef, useValue: window }
];

@NgModule({
  imports: [
    BsDropdownModule.forRoot(),
    CommonModule,
    FormsModule,
    InViewportModule.forRoot(providers),
    ToolbarModule
  ],
  exports: [
    WizardComponent
  ],
  declarations: [
    ActivateBoosterComponent,
    GitProviderStepComponent,
    MissionRuntimeStepComponent,
    ProjectProgressComponent,
    ProjectSummaryStepComponent,
    ReleaseStrategyStepComponent,
    StepIndicatorComponent,
    TargetEnvironmentStepComponent,
    WizardComponent
  ],
  providers: [
    BsDropdownConfig
  ]
})
export class LauncherModule {
  constructor() {}
}

// Models
export { Mission } from './model/mission.model';
export { Runtime } from './model/runtime.model';
export { Cluster } from './model/cluster.model';
export { Pipeline } from './model/pipeline.model';
export { Progress } from './model/progress.model';
export { Summary } from './model/summary.model';

// Services
export { ClusterService } from './service/cluster.service';
export { GitProviderService } from './service/gitprovider.service';
export { MissionRuntimeService } from './service/mission-runtime.service';
export { PipelineService } from './service/pipeline.service';
export { ProjectProgressService } from './service/project-progress.service';
export { ProjectSummaryService } from './service/project-summary.service';
