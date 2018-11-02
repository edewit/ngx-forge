import { Component, Host, OnInit, Optional } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { LauncherStep } from '../../launcher-step';
import { LauncherComponent } from '../../launcher.component';
import { Projectile } from '../../model/projectile.model';

import { Capability } from '../../model/capabilities.model';
import { CapabilitiesService } from '../../service/capabilities.service';

@Component({
  selector: 'f8launcher-capabilities-step',
  templateUrl: './capabilities-step.component.html',
  styleUrls: ['./capabilities-step.component.less']
})
export class CapabilitiesStepComponent extends LauncherStep implements OnInit {
  completed: boolean;
  capabilities: Capability[];
  selectedCapabilities: string[] = [];

  constructor(@Host() @Optional() public launcherComponent: LauncherComponent,
      private capabilitiesService: CapabilitiesService,
      public _DomSanitizer: DomSanitizer,
      private projectile: Projectile<any>) {
    super(projectile);
  }

  ngOnInit(): void {
    if (this.launcherComponent) {
      this.launcherComponent.addStep(this);
    }
    this.capabilitiesService.getCapabilities().subscribe(capabilities => this.capabilities = capabilities);
  }

  selectModule(input: HTMLInputElement, i: number): void {
    this.selectedCapabilities[i] = input.checked ? input.value : undefined;
  }

  properties(capability: Capability) {
    return Object.keys(capability.props);
  }
}
