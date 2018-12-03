import { Component, Host, OnInit, Optional } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { Broadcaster } from 'ngx-base';
import { LauncherStep } from '../../launcher-step';
import { LauncherComponent } from '../../launcher.component';
import { Projectile, StepState } from '../../model/projectile.model';
import { Enum, Enums } from '../../model/runtime.model';
import { AppCreatorService } from '../../service/app-creator.service';


@Component({
  selector: 'f8launcher-runtime-step',
  templateUrl: './runtime-step.component.html',
  styleUrls: ['./runtime-step.component.less']
})
export class RuntimeStepComponent extends LauncherStep implements OnInit {
  private enums: Enums;
  runtimes: Enum[];
  selectedRuntime: any = { value: {} };

  constructor(@Host() @Optional() public launcherComponent: LauncherComponent,
    public _DomSanitizer: DomSanitizer,
    private appCreatorService: AppCreatorService,
    private broadcaster: Broadcaster,
    private projectile: Projectile<Enum>) {
    super(projectile);
  }

  ngOnInit(): void {
    const state = new StepState(this.selectedRuntime,
      [
        { name: 'runtime', value: 'value' }
      ]
    );
    this.projectile.setState(this.id, state);
    if (this.launcherComponent) {
      this.launcherComponent.addStep(this);
    }

    this.appCreatorService.getEnums().subscribe(enums => {
      this.enums = enums;
      this.runtimes = enums['runtime.name'];
      this.restore();
    });
  }

  selectRuntime(runtime: Enum) {
    Object.assign(this.selectedRuntime, runtime);
    if (runtime) {
      this.selectedRuntime.value.version = this.enums['runtime.version.' + runtime.id][0].id;
      this.broadcaster.broadcast('runtime-changed', runtime);
    } else {
      this.selectedRuntime.value.name = null;
    }
  }

  restoreModel?(model: any): void {
    this.selectedRuntime.value = model.runtime;
    const runtime = this.runtimes.find(runtime => runtime.id === model.runtime.name);
    Object.assign(this.selectedRuntime, runtime);
  }

  get completed(): boolean {
    return !!this.selectedRuntime.value.name;
  }
}
