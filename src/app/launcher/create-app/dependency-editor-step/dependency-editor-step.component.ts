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

import { DependencyCheckService } from '../../service/dependency-check.service';
import { Selection } from '../../model/selection.model';
// import { TargetEnvironment } from '../../model/target-environment.model';
// import { TargetEnvironmentService } from '../../service/target-environment.service';
import { LauncherComponent } from '../../launcher.component';
import { LauncherStep } from '../../launcher-step';
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
    public boosterInfo: any = {};
    private cacheInfo: any = {};
    private changes: any = {};

    private subscriptions: Subscription[] = [];
    // private _targetEnvironments: TargetEnvironment[];
    constructor(
        @Host() public launcherComponent: LauncherComponent,
        private depEditorService: DependencyCheckService,
        public _DomSanitizer: DomSanitizer,
        private keyValueDiffers: KeyValueDiffers
    ) {
        super();
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
        console.log('Inside dep editor component');
        setTimeout(() => {
            // this.boosterInfo = {
            //     mission: {
            //         id: 'rest-http',
            //         name: 'REST API Level 0'
            //     },
            //     runtime: {
            //         id: 'vert.x',
            //         name: 'Eclipse Vert.x',
            //         version: 'redhat',
            //         projectVersion: 'redhat',
            //         icon: `data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 280'%3E%3Cpath fill='%23022B37' d='M107 170.8L67.7 72H46.9L100 204h13.9L167 72h-20.4zm64 33.2h80v-20h-61v-37h60v-19h-60V91h61V72h-80zm180.1-90.7c0-21-14.4-42.3-43.1-42.3h-48v133h19V91h29.1c16.1 0 24 11.1 24 22.4 0 11.5-7.9 22.6-24 22.6H286v9.6l48 58.4h24.7L317 154c22.6-4 34.1-22 34.1-40.7m56.4 90.7v-1c0-6 1.7-11.7 4.5-16.6V91h39V71h-99v20h41v113h14.5z'/%3E%3Cpath fill='%23623C94' d='M458 203c0-9.9-8.1-18-18-18s-18 8.1-18 18 8.1 18 18 18 18-8.1 18-18M577.4 72h-23.2l-27.5 37.8L499.1 72h-40.4c12.1 16 33.6 46.8 47.8 66.3l-37 50.9c2 4.2 3.1 8.9 3.1 13.8v1H499l95.2-132h-16.8zm-19.7 81.5l-20.1 27.9 16.5 22.6h40.2c-9.6-13.7-24-33.3-36.6-50.5z'/%3E%3C/svg%3E`
            //     }
            // };
            this.restoreSummary();
        }, 10); // Avoids ExpressionChangedAfterItHasBeenCheckedError
        // this.subscriptions.push(this.targetEnvironmentService.getTargetEnvironments().subscribe((val) => {
        //   if (val !== undefined) {
        //     this._targetEnvironments = val;
        //   }
        // }));
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
        // this.listenForChanges();
    }

    // Accessors
    /**
     * Returns indicator that step is completed
     *
     * @returns {boolean} True if step is completed
     */
    get stepCompleted(): boolean {
        return (this.launcherComponent.summary.dependencyCheck === undefined);
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

    updateTargetEnvSelection(): void {
        this.initCompleted();
    }

    public pickDependencies(event: any) {
        if (event)
        this.launcherComponent.summary.dependencyCheck['dependencySnapshot'] = event;
    }

    public pickMetadata(event: any) {
        if (event) {
        this.launcherComponent.summary.dependencyCheck.mavenArtifact = event.artifactId;
        this.launcherComponent.summary.dependencyCheck.groupId = event.groupId;
        this.launcherComponent.summary.dependencyCheck.projectVersion = event.version;
        }
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
                        if (response && response.gitRepo) {
                            this.github = response.gitRepo;
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
        }
        this.initCompleted(); // Ensure this is called for launcherComponent.targetEnvironment input
    }
}
