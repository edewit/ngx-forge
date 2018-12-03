import { Component, Host, OnInit, Optional } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { LauncherStep } from '../../launcher-step';
import { LauncherComponent } from '../../launcher.component';
import { Capability } from '../../model/capabilities.model';
import { Projectile, StepState } from '../../model/projectile.model';
import { AppCreatorService } from '../../service/app-creator.service';

@Component({
  selector: 'f8launcher-frontend-step',
  templateUrl: './frontend-step.component.html',
  styleUrls: ['./frontend-step.component.less']
})
export class FrontendStepComponent extends LauncherStep implements OnInit {
  completed: boolean = true;
  capabilities: Capability[];
  selectedCapability: Capability = new Capability();

  constructor(@Host() @Optional() public launcherComponent: LauncherComponent,
    public _DomSanitizer: DomSanitizer,
    private appCreatorService: AppCreatorService,
    private projectile: Projectile<any>) {
    super(projectile);
  }

  ngOnInit(): void {
    const state = new StepState(this.selectedCapability,
      [{ name: 'frontend', value: 'module', restorePath: 'capabilities.module' }]
    );
    this.projectile.setState(this.id, state);

    if (this.launcherComponent) {
      this.launcherComponent.addStep(this);
    }

    this.appCreatorService.getFrontendCapabilities()
      .subscribe(capabilities => {
        this.capabilities = capabilities;
        this.restore(this);
        if (this.selectedCapability.module) {
          this.selectCapability(this.selectedCapability);
        }
      });
  }

  selectCapability(capability: Capability) {
    const value = capability.module;
    this.projectile.getState('Capabilities').state.capabilities.set(value, { module: value });
  }

  removeCapabilities() {
    for (const capability of this.capabilities) {
      this.projectile.getState('Capabilities').state.capabilities.delete(capability.module);
    }

    this.selectedCapability.module = null;
  }
}
