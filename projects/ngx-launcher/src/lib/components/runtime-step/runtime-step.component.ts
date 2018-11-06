import { Component, Host, OnInit, Optional } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { LauncherStep } from '../../launcher-step';
import { LauncherComponent } from '../../launcher.component';
import { Runtime } from '../../launcher.module';
import { Projectile, StepState } from '../../model/projectile.model';
import { AppCreatorService } from '../../service/app-creator.service';


@Component({
  selector: 'f8launcher-runtime-step',
  templateUrl: './runtime-step.component.html',
  styleUrls: ['./runtime-step.component.less']
})
export class RuntimeStepComponent extends LauncherStep implements OnInit {
  runtimes: Runtime[];
  selectedRuntime: Runtime = new Runtime();

  constructor(@Host() @Optional() public launcherComponent: LauncherComponent,
    public _DomSanitizer: DomSanitizer,
    private appCreatorService: AppCreatorService,
    private projectile: Projectile<Runtime>) {
    super(projectile);
  }

  ngOnInit(): void {
    const state = new StepState(this.selectedRuntime,
      [
        { name: 'runtime', value: 'id', restorePath: 'runtimes.id' }
      ]
    );
    this.projectile.setState(this.id, state);
    if (this.launcherComponent) {
      this.launcherComponent.addStep(this);
    }

    this.appCreatorService.getRuntimes().subscribe(runtimes => {
      this.runtimes = runtimes;
      this.restore(this);
    });
  }

  get completed(): boolean {
    return !!this.selectedRuntime.id;
  }
}
