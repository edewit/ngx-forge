import { Component, Host, OnInit, Optional } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { LauncherStep } from '../../launcher-step';
import { LauncherComponent } from '../../launcher.component';
import { Projectile, StepState } from '../../model/projectile.model';

import { Capability, SelectedCapability } from '../../model/capabilities.model';
import { AppCreatorService } from '../../service/app-creator.service';

@Component({
  selector: 'f8launcher-capabilities-step',
  templateUrl: './capabilities-step.component.html',
  styleUrls: ['./capabilities-step.component.less']
})
export class CapabilitiesStepComponent extends LauncherStep implements OnInit {
  completed: boolean = true;
  capabilities: Capability[];
  selected: SelectedCapability = new SelectedCapability();

  constructor(@Host() @Optional() public launcherComponent: LauncherComponent,
      private appCreatorService: AppCreatorService,
      public _DomSanitizer: DomSanitizer,
      private projectile: Projectile<SelectedCapability>) {
    super(projectile);
  }

  ngOnInit(): void {
    const state = new StepState(this.selected, [
      { name: 'capabilities', value: 'capabilities' }
    ]);
    this.projectile.setState(this.id, state);

    if (this.launcherComponent) {
      this.launcherComponent.addStep(this);
    }
    this.appCreatorService.getFilteredCapabilities().subscribe(capabilities => {
      this.capabilities = capabilities;
      this.restore();
    });
  }

  selectModule(input: HTMLInputElement, i: number): void {
    this.selected.capabilities[i] = input.checked ? { module: input.value } : undefined;
  }

  selectProperty(key: string, i: number, value: string) {
    if (this.selected.capabilities[i]) {
      this.selected.capabilities[i][key] = value;
    }
  }

  restoreModel(model: any): void {
    this.selected.capabilities = model.capabilities;
  }

  properties(capability: Capability) {
    return Object.keys(capability.props);
  }
}
