import { Component, Host, OnInit, Optional } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { LauncherStep } from '../../launcher-step';
import { LauncherComponent } from '../../launcher.component';
import { Projectile, StepState } from '../../model/projectile.model';
import { Enum } from '../../model/runtime.model';
import { AppCreatorService } from '../../service/app-creator.service';

@Component({
  selector: 'f8launcher-frontend-step',
  templateUrl: './frontend-step.component.html',
  styleUrls: ['./frontend-step.component.less']
})
export class FrontendStepComponent extends LauncherStep implements OnInit {
  completed: boolean = true;
  frontendCapabilities: Enum[];
  selectedFrontend: any = { value: {} };

  constructor(@Host() @Optional() public launcherComponent: LauncherComponent,
    public _DomSanitizer: DomSanitizer,
    private appCreatorService: AppCreatorService,
    private projectile: Projectile<any>) {
    super(projectile);
  }

  ngOnInit(): void {
    const state = new StepState(this.selectedFrontend,
      [{ name: 'frontend', value: 'value' }]
    );
    this.projectile.setState(this.id, state);

    if (this.launcherComponent) {
      this.launcherComponent.addStep(this);
    }

    this.appCreatorService.getEnums()
      .subscribe(enums => {
        this.frontendCapabilities = enums['framework.name'];
        this.restore();
      });
  }

  selectFrontend(frontend: Enum) {
    Object.assign(this.selectedFrontend, frontend);
    if (!frontend) {
      this.selectedFrontend.value.name = null;
      this.updateCapabilityState(null);
    } else {
      this.updateCapabilityState(this.selectedFrontend.value);
    }
  }

  restoreModel(model: any): void {
    this.selectedFrontend.value = model.frontend;
    const frontend = this.frontendCapabilities.find(frontend => frontend.id === model.frontend.name);
    Object.assign(this.selectedFrontend, frontend);
    this.updateCapabilityState(this.selectedFrontend.value);
  }

  private updateCapabilityState(value: any) {
    const capabilities = this.projectile.getState('Capabilities').state.capabilities;
    if (value) {
      capabilities.set(value.name,
        { module: 'web-app', 'framework': value }
      );
    } else {
      this.frontendCapabilities.forEach(fe => capabilities.delete(fe.id));
    }
  }
}
