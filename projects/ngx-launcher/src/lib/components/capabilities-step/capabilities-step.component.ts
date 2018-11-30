import { Component, Host, OnInit, Optional } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { LauncherStep } from '../../launcher-step';
import { LauncherComponent } from '../../launcher.component';
import { Projectile, StepState } from '../../model/projectile.model';

import { Broadcaster } from 'ngx-base';
import { Capability, Property, SelectedCapability } from '../../model/capabilities.model';
import { Runtime } from '../../model/runtime.model';
import { AppCreatorService } from '../../service/app-creator.service';

@Component({
  selector: 'f8launcher-capabilities-step',
  templateUrl: './capabilities-step.component.html',
  styleUrls: ['./capabilities-step.component.less']
})
export class CapabilitiesStepComponent extends LauncherStep implements OnInit {
  completed: boolean = true;
  allCapabilities: Capability[];
  capabilities: Capability[];
  selected: SelectedCapability = new SelectedCapability();

  constructor(@Host() @Optional() public launcherComponent: LauncherComponent,
      private appCreatorService: AppCreatorService,
      public _DomSanitizer: DomSanitizer,
      private broadcaster: Broadcaster,
      private projectile: Projectile<SelectedCapability>) {
    super(projectile);
  }

  ngOnInit(): void {
    const state = new StepState(this.selected, [
      { name: 'capabilities', value: 'values' }
    ]);
    this.projectile.setState(this.id, state);

    if (this.launcherComponent) {
      this.launcherComponent.addStep(this);
    }
    this.appCreatorService.getFilteredCapabilities()
      .subscribe(capabilities => {
        this.allCapabilities = capabilities;
        this.capabilities = capabilities;
        this.restore();
      });

    this.broadcaster.on<Runtime>('runtime-changed').subscribe(runtime => {
      this.capabilities = this.allCapabilities.filter(capability => {
        for (const prop of capability.props) {
          if (prop.id === 'runtime') {
            return prop['props'].find(p => p.id === 'name').values.indexOf(runtime.id) !== -1;
          }
        }
        return true;
      });
    });
  }

  selectModule(input: HTMLInputElement): void {
    if (input.checked) {
      this.selected.capabilities.set(input.value, { module: input.value });
    } else {
      this.selected.capabilities.delete(input.value);
    }
  }

  selectProperty(module: string, key: Property) {
    this.selected.capabilities.get(module)[key.id] = key['value'];
  }

  restoreModel(model: any): void {
    this.selected.values = model.capabilities;
  }

  navToPrevStep() {
    this.broadcaster.broadcast('navigate-to', 'Runtimes');
  }
}
