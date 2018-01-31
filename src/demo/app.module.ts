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

import { LauncherModule } from '../app/launcher/launcher.module';
import { DemoGitProviderService } from './service/demo-gitprovider.service';
import { DemoMissionRuntimeService } from './service/demo-mission-runtime.service';
import { DemoPipelineService } from './service/demo-pipeline.service';
import { GitProviderService } from '../app/launcher/launcher.module';
import { MissionRuntimeService, PipelineService } from '../app/launcher/launcher.module';

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
    { provide: GitProviderService, useClass: DemoGitProviderService},
    { provide: MissionRuntimeService, useClass: DemoMissionRuntimeService },
    { provide: PipelineService, useClass: DemoPipelineService }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
