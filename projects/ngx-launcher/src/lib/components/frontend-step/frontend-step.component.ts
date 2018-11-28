import { Component, Host, OnInit, Optional } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { LauncherStep } from '../../launcher-step';
import { LauncherComponent } from '../../launcher.component';
import { Projectile } from '../../model/projectile.model';
import { AppCreatorService } from '../../service/app-creator.service';

@Component({
  selector: 'f8launcher-frontend-step',
  templateUrl: './frontend-step.component.html',
  styleUrls: ['./frontend-step.component.less']
})
export class FrontendStepComponent extends LauncherStep implements OnInit {
  completed: boolean = true;

  constructor(@Host() @Optional() public launcherComponent: LauncherComponent,
    public _DomSanitizer: DomSanitizer,
    private appCreatorService: AppCreatorService,
    private projectile: Projectile<any>) {
    super(projectile);
  }

  ngOnInit(): void {
    if (this.launcherComponent) {
      this.launcherComponent.addStep(this);
    }
  }

}
