import {async, ComponentFixture, TestBed, tick} from '@angular/core/testing';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { SortArrayPipeModule } from 'patternfly-ng/pipe';

import { LauncherComponent } from '../../launcher.component';
import { LauncherStep } from '../../launcher-step';
import { PipelineService } from '../../service/pipeline.service';
import { ReleaseStrategyCreateappStepComponent } from './release-strategy-createapp-step.component';
import { Projectile } from '../../model/projectile.model';

import { BroadcasterTestProvider } from '../targetenvironment-createapp-step/target-environment-createapp-step.component.spec';
import { Broadcaster } from 'ngx-base';
import { mavenReleasePipeline, StubbedPipelineService } from './pipelines.fixture.spec';
import { ViewRuntime } from '../mission-runtime-createapp-step/mission-runtime-createapp-step.model';
import { ButtonNextStepComponent } from '../../shared/button-next-step.component';

describe('ReleaseStrategyStepComponent', () => {
  let releaseStrategyComponent: ReleaseStrategyCreateappStepComponent;
  let fixture: ComponentFixture<ReleaseStrategyCreateappStepComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        RouterTestingModule,
        SortArrayPipeModule
      ],
      declarations: [
        ReleaseStrategyCreateappStepComponent,
        ButtonNextStepComponent
      ],
      providers : [
        Projectile,
        { provide: PipelineService, useClass: StubbedPipelineService },
        { provide: Broadcaster, useValue: BroadcasterTestProvider.broadcaster }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReleaseStrategyCreateappStepComponent);
    releaseStrategyComponent = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  describe('pipeline selection', () => {

    it('should change pipeline selection to node when runtime event change', () => {
      // given
      let pipelines = releaseStrategyComponent.pipelines;
      expect(pipelines.length).toBe(0);
      BroadcasterTestProvider.broadcaster.broadcast('runtime-changed', {pipelinePlatform: 'node'} as ViewRuntime);

      // when
      fixture.detectChanges();
      pipelines = releaseStrategyComponent.pipelines;

      // then
      expect(pipelines.length).toBe(2);
      expect(pipelines.map(value => value.id))
        .toContain( 'node-releaseandstage', 'node-releasestageapproveandpromote' );
    });

    it('should reset pipeline selection when runtime changes from maven to node', () => {
      // given
      BroadcasterTestProvider.broadcaster.broadcast('runtime-changed', {pipelinePlatform: 'maven'} as ViewRuntime);
      let pipelines = releaseStrategyComponent.pipelines;
      expect(pipelines.length).toBe(3);

      // when
      releaseStrategyComponent.updatePipelineSelection(mavenReleasePipeline);
      BroadcasterTestProvider.broadcaster.broadcast('runtime-changed', {pipelinePlatform: 'node'} as ViewRuntime);
      fixture.detectChanges();
      pipelines = releaseStrategyComponent.pipelines;

      // then
      expect(pipelines.length).toBe(2);
      expect(pipelines.map(value => value.id))
        .toContain( 'node-releaseandstage', 'node-releasestageapproveandpromote' );
    });

    it('should not show pipelines when runtime not selected', () => {
      expect(releaseStrategyComponent.pipelines.length).toBe(0);
    });

  });

});
