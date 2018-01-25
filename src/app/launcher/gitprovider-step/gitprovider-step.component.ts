import { Component, Host, OnInit, ViewEncapsulation } from '@angular/core';

import { GitProviderService } from '../service/gitprovider.service';
import { Selection } from '../model/selection.model';
import { WizardComponent } from '../wizard.component';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8launcher-gitprovider-step',
  templateUrl: './gitprovider-step.component.html',
  styleUrls: ['./gitprovider-step.component.less']
})
export class GitProviderStepComponent implements OnInit {
  constructor(@Host() public wizardComponent: WizardComponent,
              private gitProviderService: GitProviderService) {
  }

  ngOnInit() {
  }

  /**
   * Authorize GitHub account
   *
   * @param {MouseEvent} $event
   */
  authorize($event: MouseEvent): void {
    let url = window.location.origin + this.getParams(this.wizardComponent.selection);
    this.gitProviderService.authorize(url);
  }

  private getParams(selection: Selection) {
    if (selection === undefined) {
      return '';
    }
    return '?selection=' + JSON.stringify(selection);
  }
}
