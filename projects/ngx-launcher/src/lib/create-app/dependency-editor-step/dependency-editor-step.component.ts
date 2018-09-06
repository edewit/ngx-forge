import {
  Component,
  DoCheck,
  Host,
  Input,
  KeyValueDiffers,
  OnDestroy,
  OnInit,
  Optional,
  ViewEncapsulation
} from '@angular/core';
import { Subscription } from 'rxjs';
import { Broadcaster } from 'ngx-base';

import { DependencyCheckService } from '../../service/dependency-check.service';
import { DependencyEditorService } from '../../service/dependency-editor.service';
import { Selection } from '../../model/selection.model';
import { LauncherComponent } from '../../launcher.component';
import { LauncherStep } from '../../launcher-step';
import { DependencyEditor } from '../../model/dependency-editor/dependency-editor.model';
import { broadcast } from '../../shared/telemetry.decorator';

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'f8launcher-dependencychecker-createapp-step',
    templateUrl: './dependency-editor-step.component.html',
    styleUrls: ['./dependency-editor-step.component.less']
})
export class DependencyEditorCreateappStepComponent extends LauncherStep implements OnInit, OnDestroy, DoCheck {
    @Input() id: string;
    @Input() depEditorFlag: boolean;

    public github = '';
    public gitref = '';
    public boosterInfo: any = null;
    public metadataInfo: any = null;

    public blankResponse: any = null;

    private cacheInfo: any = {};
    private changes: any = {};

    private subscriptions: Subscription[] = [];
    constructor(
        @Host() public launcherComponent: LauncherComponent,
        public broadcaster: Broadcaster,
        @Optional() private depEditorService: DependencyEditorService,
        private dependencyCheckService: DependencyCheckService,
        private keyValueDiffers: KeyValueDiffers
    ) {
        super(launcherComponent);
        if (this.launcherComponent.summary) {
            this.launcherComponent.summary['dependencyEditor'] = new DependencyEditor();
        }
    }

    ngOnDestroy() {
        this.subscriptions.forEach((sub) => {
            sub.unsubscribe();
        });
    }


    ngOnInit() {
        this.changes = this.keyValueDiffers.find(this.launcherComponent.summary).create();
        this.launcherComponent.addStep(this);
        this.dependencyCheckService.getDependencyCheck()
        .subscribe((val) => {
            this.metadataInfo = val;
        });
    }

    ngDoCheck() {
        const updates: any = this.changes.diff(this.launcherComponent.summary);
        if (updates) {
            updates.forEachChangedItem((r: any) => {
                this.listenForChanges(r);
            });
            updates.forEachAddedItem((r: any) => {
                this.listenForChanges(r);
            });
            updates.forEachRemovedItem((r: any) => {
                this.listenForChanges(r);
            });
        }
    }

    // Accessors
    /**
     * Returns indicator that step is completed
     *
     * @returns {boolean} True if step is completed
     */
    get completed(): boolean {
        return (this.launcherComponent.summary.dependencyEditor !== undefined);
    }

    /**
     * Returns target environments to display
     *
     * @returns {TargetEnvironment[]} The target environments to display
     */
    // Steps
    @broadcast('completeDependencyEditorStep', {
        'launcherComponent.summary.dependencyEditor': {
            dependencySnapshot: 'dependencySnapshot'
        }
    })
    navToNextStep(): void {
        this.launcherComponent.navToNextStep('SelectDependencies');
    }

    /**
     * Navigate to step
     *
     * @param {string} id The step ID
     */
    navToStep(event: string) {
        this.launcherComponent.stepIndicator.navToStep(event);
    }

    public pickDependencies(event: any) {
        if (event) {
            this.launcherComponent.summary.dependencyEditor['dependencySnapshot'] = event;
        }
    }

    public pickMetadata(event: any) {
        if (event) {
            this.launcherComponent.summary.dependencyCheck.mavenArtifact = event.artifactId;
            this.launcherComponent.summary.dependencyCheck.groupId = event.groupId;
            this.launcherComponent.summary.dependencyCheck.projectVersion = event.version;

            // Update the dependency editor model
            this.launcherComponent.summary.dependencyEditor['mavenArtifact'] = event.artifactId;
            this.launcherComponent.summary.dependencyEditor['groupId'] = event.groupId;
            this.launcherComponent.summary.dependencyEditor['projectVersion'] = event.version;
        }
    }

    private listenForChanges(change: any): void {
        let flag = false;
        const current = change.currentValue;
        if (!current) {
            return;
        }
        if (change && change.key === 'runtime') {
            if (
                !this.cacheInfo ||
                (
                    this.cacheInfo && this.cacheInfo.id !== current.id
                )
            ) {
                // Changes in any of them: name or version.id or version.name
                this.cacheInfo['runtime'] = {
                    name: current.name,
                    id: current.id,
                    missions: current.missions,
                    version: current.version ? current.version.id : null
                };
                flag = true;
            }
        } else if (change && change.key === 'mission') {
            this.cacheInfo['mission'] = {
                id: current.id
            };

            // If runtime is selected first, version of runtime will be null. This updates that.
            const missionsArrFromRuntime: Array<any> = this.cacheInfo['runtime'] && this.cacheInfo['runtime']['missions'];
            if (missionsArrFromRuntime && missionsArrFromRuntime.length) {
                const filteredMission =
                    missionsArrFromRuntime.filter((mission) => mission.id === this.cacheInfo['mission']['id'])[0];
                this.cacheInfo['runtime']['version'] =
                    filteredMission && filteredMission.versions && filteredMission.versions[0]
                        && filteredMission.versions[0].id || null;
            }
            flag = true;
        }

        if (flag) {
            if (this.cacheInfo['mission'] && this.cacheInfo['runtime']) {
                // this.cacheInfo = JSON.parse(this.cacheInfo);
                this.boosterInfo = this.cacheInfo;
                if (this.cacheInfo['mission'].id === 'blank-mission') {
                    this.handleBlankMissionFlow(this.cacheInfo['runtime'].id);
                    return;
                }
                this.blankResponse = null;
                const mission: string = this.cacheInfo['mission'].id;
                const runtime: string = this.cacheInfo['runtime'].id;
                this.boosterInfo = this.cacheInfo;
                const missionObj = <any>this.launcherComponent.summary.mission;
                if (missionObj && missionObj['boosters'] && missionObj['boosters'].length) {
                    missionObj['boosters'].forEach((booster: any) => {
                        if (mission === booster.mission.id && runtime === booster.runtime.id) {
                            this.github = booster.source.git.url;
                            this.gitref = booster.source.git.ref;
                        }
                    });
                }
            }
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

    // Restore mission & runtime summary
    private restoreSummary(): void {
        const selection: Selection = this.launcherComponent.selectionParams;
        if (selection !== undefined) {
            this.launcherComponent.summary.targetEnvironment = selection.targetEnvironment;
            this.launcherComponent.summary.dependencyCheck = selection.dependencyCheck;
            this.launcherComponent.summary.dependencyEditor = selection.dependencyEditor;
        }
    }
}
