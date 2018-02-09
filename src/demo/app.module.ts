// import './rxjs-extensions';

import { NgModule, Provider } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

// App components
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// Main areas
import { WelcomeComponent } from './components/welcome.component';

import { DemoDependencyCheckService } from './service/demo-dependency-check.service';
import { DemoGitProviderService } from './service/demo-git-provider.service';
import { DemoMissionRuntimeService } from './service/demo-mission-runtime.service';
import { DemoPipelineService } from './service/demo-pipeline.service';
import { DemoProjectProgressService } from './service/demo-project-progress.service';
import { DemoProjectSummaryService } from './service/demo-project-summary.service';
import { DemoTargetEnvironmentService } from './service/demo-target-environment.service';

import {
  DependencyCheckService,
  GitProviderService,
  LauncherModule,
  MissionRuntimeService,
  PipelineService,
  ProjectProgressService,
  ProjectSummaryService,
  TargetEnvironmentService
} from '../app/launcher/launcher.module';

@NgModule({
  imports: [
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    LauncherModule
  ],
  declarations: [
    AppComponent,
    WelcomeComponent
  ],
  providers: [
    { provide: DependencyCheckService, useClass: DemoDependencyCheckService},
    { provide: GitProviderService, useClass: DemoGitProviderService},
    { provide: MissionRuntimeService, useClass: DemoMissionRuntimeService },
    { provide: PipelineService, useClass: DemoPipelineService },
    { provide: ProjectProgressService, useClass: DemoProjectProgressService },
    { provide: ProjectSummaryService, useClass: DemoProjectSummaryService },
    { provide: TargetEnvironmentService, useClass: DemoTargetEnvironmentService}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
