import { NgModule, Provider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StepIndicatorComponent } from './step-indicator/step-indicator.component';
import { WizardComponent } from './wizard.component';
import { InViewportModule, WindowRef } from '@thisissoon/angular-inviewport';
import { MissionRuntimeStepComponent } from './mission-runtime-step/mission-runtime-step.component';
import { TargetEnvironmentStepComponent } from './targetenvironment-step/target-environment-step.component';
import { GitProviderStepComponent } from './gitprovider-step/gitprovider-step.component';
import { ReleaseStrategyStepComponent } from './release-strategy-step/release-strategy-step.component';
import { ProjectSummaryStepComponent } from './project-summary-step/project-summary-step.component';
import { ActivateBoosterComponent } from './activate-booster/activate-booster.component';
import { NewProjectComponent } from './new-project/new-project.component';
import { MissionRuntimeService } from './service/mission-runtime.service';
import { BsDropdownModule } from 'ngx-bootstrap';

// Provide window object so as to not break SSR if using universal
export const providers: Provider[] = [
  { provide: WindowRef, useValue: window }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    InViewportModule.forRoot(providers),
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
    ActivateBoosterComponent,
    NewProjectComponent
  ]
})
export class LauncherModule {
  constructor() {}
}

export { GitProviderService } from './service/gitprovider.service';
export { MissionRuntimeService } from './service/mission-runtime.service';
export { PipelineService } from './service/pipeline.service';
export { ClusterService } from './service/cluster.service';
export { Mission } from './model/mission.model';
export { Runtime } from './model/runtime.model';
export { Cluster } from './model/cluster.model';
export { Pipeline } from './model/pipeline.model';
