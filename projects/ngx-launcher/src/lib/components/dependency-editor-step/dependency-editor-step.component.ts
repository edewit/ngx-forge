import {
  Component,
  Host,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  ViewEncapsulation
} from '@angular/core';
import { Subscription } from 'rxjs';
import { Broadcaster } from 'ngx-base';

import { DependencyCheckService } from '../../service/dependency-check.service';
import { DependencyEditorService } from '../../service/dependency-editor.service';
import { LauncherComponent } from '../../launcher.component';
import { LauncherStep } from '../../launcher-step';
import { DependencyEditor } from '../../model/dependency-editor/dependency-editor.model';
import { broadcast } from '../../shared/telemetry.decorator';
import { Projectile, StepState } from '../../model/summary.model';
import { DependencyCheck } from '../../model/dependency-check.model';

import * as _ from 'lodash';
import { BoosterState } from '../../model/booster.model';

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'f8launcher-dependencychecker-createapp-step',
    templateUrl: './dependency-editor-step.component.html',
    styleUrls: ['./dependency-editor-step.component.less']
})
export class DependencyEditorCreateappStepComponent extends LauncherStep implements OnInit, OnDestroy {
    @Input() id: string;
    @Input() depEditorFlag: boolean;

    public github = '';
    public gitref = '';
    public boosterInfo: any = null;
    public metadataInfo: any = null;

    public blankResponse: any = null;

    dependencyEditor = new DependencyEditor();
    dependencyCheck = new DependencyCheck();

    private subscriptions: Subscription[] = [];
    constructor(
        @Host() @Optional() public launcherComponent: LauncherComponent,
        public broadcaster: Broadcaster,
        @Optional() private depEditorService: DependencyEditorService,
        private dependencyCheckService: DependencyCheckService,
        private projectile: Projectile<{ dep: DependencyEditor }>
    ) {
        super(projectile);
        this.broadcaster.on<BoosterState>('booster-changed').subscribe(booster => {
          const artifactTS: number = Date.now();
          const artifactRuntime = booster.runtime.id.replace(/[.\-_]/g, '');
          const artifactMission = booster.mission.id.replace(/[.\-_]/g, '');
          (<any>this.dependencyCheck).mission = booster.mission;
          this.dependencyCheck.mavenArtifact = `booster-${artifactMission}-${artifactRuntime}-${artifactTS}`;

          this.boosterInfo = _.cloneDeep(booster);
          if (booster.mission.id === 'blank-mission') {
            this.handleBlankMissionFlow(booster.runtime.id);
          } else {
            booster.mission['boosters'].forEach((b: any) => {
              if (booster.mission.id === b.mission.id && booster.runtime.id === b.runtime.id) {
                  this.github = b.source.git.url;
                  this.gitref = b.source.git.ref;
              }
            });
          }
          this.boosterInfo.runtime.version = booster.runtime.version.id;
      });
    }

    ngOnDestroy() {
        this.subscriptions.forEach((sub) => {
            sub.unsubscribe();
        });
    }

    ngOnInit() {
        const state = new StepState({ dep: this.dependencyEditor }, [
          { name: 'dependencyEditor', value: 'dep' }
        ]);
        this.projectile.setState(this.id, state);

        if (this.launcherComponent) {
        this.launcherComponent.addStep(this);
        }
        this.dependencyCheckService.getDependencyCheck()
        .subscribe((val) => {
            this.metadataInfo = val;
            this.restore();
        });
        }

    // Accessors
    /**
     * Returns indicator that step is completed
     *
     * @returns {boolean} True if step is completed
     */
    get completed(): boolean {
        return (this.dependencyEditor !== undefined);
    }

    /**
     * Navigate to step
     *
     * @param {string} id The step ID
     */
    navToStep(event: string) {
        this.broadcaster.broadcast('navigate-to', event);
    }

    public pickDependencies(event: any) {
        if (event) {
            this.dependencyEditor['dependencySnapshot'] = event;
        }
    }

    public pickMetadata(event: any) {
        if (event) {
            this.dependencyCheck.mavenArtifact = event.artifactId;
            this.dependencyCheck.groupId = event.groupId;
            this.dependencyCheck.projectVersion = event.version;

            // // Update the dependency editor model
            this.dependencyEditor['mavenArtifact'] = event.artifactId;
            this.dependencyEditor['groupId'] = event.groupId;
            this.dependencyEditor['projectVersion'] = event.version;
        }
    }

    private handleBlankMissionFlow(runtimeId: string): void {
        if (this.depEditorService && runtimeId) {
            const service = this.depEditorService.getCoreDependencies(runtimeId);
            if (service) {
                service.subscribe((response: any) => {
                    if (response) {
                        this.blankResponse = response;
                    }
                });
            }
        }
    }

    restoreModel(model: any): void {
      this.dependencyEditor = model.dependencyEditor;
    }
}
