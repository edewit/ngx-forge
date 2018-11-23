import { Location } from '@angular/common';
import {
  Component,
  Host,
  ViewEncapsulation
} from '@angular/core';

import { LauncherComponent } from '../../launcher.component';
import { DependencyCheck } from '../../model/dependency-check.model';
import { Projectile } from '../../model/projectile.model';
import { TargetEnvironmentSelection } from '../../model/target-environment.model';
import { Config } from '../../service/config.component';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8launcher-activatebooster-nextstep',
  templateUrl: './activate-booster-nextstep.component.html',
  styleUrls: ['./activate-booster-nextstep.component.less']
})
export class ActivateBoosterNextstepComponent {

  constructor(@Host() public launcherComponent: LauncherComponent,
      private config: Config,
      private projectile: Projectile<TargetEnvironmentSelection>) {
  }

  get dependencyCheck(): DependencyCheck {
    return this.projectile.sharedState.state;
  }

  get isCreatorFlow(): boolean {
    return this.projectile.getState('Capabilities') !== undefined;
  }
  get downloadLink(): string {
    const file = 'download?id=' + this.launcherComponent.statusLink['id'];
    return Location.joinWithSlash(this.config.get('creator_url') || 'http://dummylink', file);
  }
}
