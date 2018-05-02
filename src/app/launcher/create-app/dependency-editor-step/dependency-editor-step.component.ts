import {
    Component,
    DoCheck,
    Host,
    Input,
    KeyValueDiffers,
    OnInit,
    OnDestroy,
    ViewEncapsulation
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs/Subscription';

import { DependencyEditorService } from '../../service/dependency-editor.service';
import { DependencyCheckService } from '../../service/dependency-check.service';
import { Selection } from '../../model/selection.model';
// import { TargetEnvironment } from '../../model/target-environment.model';
// import { TargetEnvironmentService } from '../../service/target-environment.service';
import { LauncherComponent } from '../../launcher.component';
import { LauncherStep } from '../../launcher-step';
import { DependencyEditor } from '../../model/dependency-editor/dependency-editor.model';
import { Summary } from '../../model/summary.model';

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'f8launcher-dependencychecker-createapp-step',
    templateUrl: './dependency-editor-step.component.html',
    styleUrls: ['./dependency-editor-step.component.less']
})
export class DependencyEditorCreateappStepComponent extends LauncherStep implements OnInit, OnDestroy, DoCheck {
    @Input() id: string;

    public github: string = '';
    public gitref: string = '';
    public boosterInfo: any = null;
    public metadataInfo: any = null;
    private cacheInfo: any = {};
    private changes: any = {};

    private subscriptions: Subscription[] = [];
    // private _targetEnvironments: TargetEnvironment[];
    constructor(
        @Host() public launcherComponent: LauncherComponent,
        private depEditorService: DependencyEditorService,
        private dependencyCheckService: DependencyCheckService,
        public _DomSanitizer: DomSanitizer,
        private keyValueDiffers: KeyValueDiffers
    ) {
        super();
        this.launcherComponent.summary.dependencyEditor = new DependencyEditor();
    }

    ngOnDestroy() {
        this.subscriptions.forEach((sub) => {
            sub.unsubscribe();
        });
    }

    // getGithubInformation(missionId: string, runtimeId: string, version: string = 'redhat'): void {
    //   this.depCheckService.getGithubInformation(
    //     missionId,
    //     runtimeId,
    //     version
    //   ).subscribe((result) => {
    //     this.github = result && result.gitRepo;
    //   });
    // }
    ngOnInit() {
        this.changes = this.keyValueDiffers.find(this.launcherComponent.summary).create(null);
        this.launcherComponent.addStep(this);
        this.dependencyCheckService.getDependencyCheck()
        .subscribe((val) => {
            this.metadataInfo = val;
        });
    }

    ngDoCheck() {
        let updates: any = this.changes.diff(this.launcherComponent.summary);
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
    get stepCompleted(): boolean {
        return (this.launcherComponent.summary.dependencyEditor !== undefined);
    }

    /**
     * Returns target environments to display
     *
     * @returns {TargetEnvironment[]} The target environments to display
     */
    // get targetEnvironments(): TargetEnvironment[] {
    //   return this._targetEnvironments;
    // }
    // Steps
    navToNextStep(): void {
        this.launcherComponent.navToNextStep();
    }

    /**
     * Navigate to step
     *
     * @param {string} id The step ID
     */
    navToStep(event: string) {
        this.launcherComponent.stepIndicator.navToStep(event);
    }

    updateTargetEnvSelection(): void {
        this.initCompleted();
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
            this.launcherComponent.summary.dependencyEditor.mavenArtifact = event.artifactId;
            this.launcherComponent.summary.dependencyEditor.groupId = event.groupId;
            this.launcherComponent.summary.dependencyEditor.projectVersion = event.version;
        }
        setTimeout(() => {
            this.initCompleted();
        }, 10);
    }

    // Private
    private initCompleted(): void {
        this.launcherComponent.getStep(this.id).completed = this.stepCompleted;
    }

    private listenForChanges(change: any): void {
        let flag = false;
        if (change && change.key === 'runtime') {
            let current = change.currentValue;

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
                    version: current.version.id
                };
                flag = true;
            }
        } else if (change && change.key === 'mission') {
            let current = change.currentValue;
            this.cacheInfo['mission'] = {
                id: current.id
            };
            flag = true;
        }

        if (flag) {
            if (this.cacheInfo['mission'] && this.cacheInfo['runtime']) {
                let mission: string = this.cacheInfo['mission'].id;
                let runtime: string = this.cacheInfo['runtime'].id;
                this.boosterInfo = this.cacheInfo;
                let service = this.depEditorService.getBoosterInfo(mission, runtime);
                if (service) {
                    service.subscribe((response: any) => {
                        if (response && response.gitRepo && response.gitRef) {
                            this.github = response.gitRepo;
                            this.gitref = response.gitRef;
                        }
                    });
                }
            }
        }
    }

    // Restore mission & runtime summary
    private restoreSummary(): void {
        let selection: Selection = this.launcherComponent.selectionParams;
        if (selection !== undefined) {
            this.launcherComponent.summary.targetEnvironment = selection.targetEnvironment;
            this.launcherComponent.summary.dependencyCheck = selection.dependencyCheck;
            this.launcherComponent.summary.dependencyEditor = selection.dependencyEditor;
        }
        this.initCompleted(); // Ensure this is called for launcherComponent.targetEnvironment input
    }
}
