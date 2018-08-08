import { Component, EventEmitter, Input, Output } from '@angular/core';
import {async, ComponentFixture, TestBed, tick} from '@angular/core/testing';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { InViewportModule, WindowRef } from '@thisissoon/angular-inviewport';

import { FilterEvent } from 'patternfly-ng/filter';
import { SortArrayPipeModule } from 'patternfly-ng/pipe';
import { SortEvent } from 'patternfly-ng/sort';

import { LauncherComponent } from '../../launcher.component';
import { LauncherStep } from '../../launcher-step';
import { PipelineService } from '../../service/pipeline.service';
import { ReleaseStrategyCreateappStepComponent } from './release-strategy-createapp-step.component';
import { Selection } from '../../model/selection.model';
import { Summary } from '../../model/summary.model';

import { BroadcasterTestProvider } from
    '../targetenvironment-createapp-step/target-environment-createapp-step.component.spec';
import { Broadcaster } from 'ngx-base';
import {mavenReleasePipeline, StubbedPipelineService} from './pipelines.fixture.spec';
import { ViewRuntime } from '../mission-runtime-createapp-step/mission-runtime-createapp-step.model';

export interface TypeWizardComponent {
  selectedSection: string;
  steps: LauncherStep[];
  summary: any;
  summaryCompleted: boolean;
  addStep(step: LauncherStep): void;
  currentSelection(): any;
  onInViewportChange($event: any, id: string): any;
}

let mockWizardComponent: TypeWizardComponent = {
  selectedSection: '',
  steps: [],
  summary: {
    dependencyCheck: {},
    gitHubDetails: {}
  },
  summaryCompleted: false,
  addStep(step: LauncherStep) {
    for (let i = 0; i < this.steps.length; i++) {
      if (step.id === this.steps[i].id) {
        return;
      }
    }
    this.steps.push(step);
  },
  get currentSelection(): any {
    let summaryVar = new Summary();
    return {
      groupId: (summaryVar.dependencyCheck !== undefined) ? summaryVar.dependencyCheck.groupId : undefined,
      missionId: (summaryVar.mission !== undefined) ? summaryVar.mission.id : undefined,
      pipelineId: (summaryVar.pipeline !== undefined) ? this.summaryVar.pipeline.id : undefined,
      projectName: (summaryVar.dependencyCheck !== undefined)
        ? summaryVar.dependencyCheck.projectName : undefined,
      projectVersion: (summaryVar.dependencyCheck !== undefined)
        ? summaryVar.dependencyCheck.projectVersion : undefined,
      runtimeId: (summaryVar.runtime !== undefined) ? summaryVar.runtime.id : undefined,
      runtimeVersion: (summaryVar.runtime !== undefined) ? summaryVar.runtime.version : undefined,
      platform: (summaryVar.runtime !== undefined) ? summaryVar.runtime.pipelinePlatform : 'maven',
      spacePath: (summaryVar.dependencyCheck !== undefined)
        ? summaryVar.dependencyCheck.spacePath : undefined,
      targetEnvironment: summaryVar.targetEnvironment,
      dependencyCheck: (summaryVar.dependencyCheck !== undefined) ? summaryVar.dependencyCheck : undefined,
      dependencyEditor: (summaryVar.dependencyEditor !== undefined) ? summaryVar.dependencyEditor : undefined
    } as Selection;
  },
  onInViewportChange($event: any, id: string) {
    if ($event) {
      setTimeout(() => {
        this.selectedSection = id;
      }, 10); // Avoids ExpressionChangedAfterItHasBeenCheckedError
    }
  }
};

describe('ReleaseStrategyStepComponent', () => {
  let releaseStrategyComponent: ReleaseStrategyCreateappStepComponent;
  let fixture: ComponentFixture<ReleaseStrategyCreateappStepComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        InViewportModule,
        RouterTestingModule,
        SortArrayPipeModule
      ],
      declarations: [
        ReleaseStrategyCreateappStepComponent
      ],
      providers : [
        { provide: PipelineService, useClass: StubbedPipelineService },
        { provide: LauncherComponent, useValue: mockWizardComponent },
        { provide: WindowRef, useValue: window },
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
