import { Component, Host, OnInit, ViewEncapsulation } from '@angular/core';
import { GitProviderService } from '../service/gitprovider.service';
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

  authorize($event: MouseEvent): void {
    this.gitProviderService.authorize(this.wizardComponent.userSelection);
  }
}
