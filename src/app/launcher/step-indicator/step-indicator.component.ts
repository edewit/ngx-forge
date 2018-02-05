import {
  Component,
  Host,
  Input,
  OnInit,
  ViewEncapsulation
} from '@angular/core';

import { Selection } from '../model/selection.model';
import { WizardComponent } from '../wizard.component';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8launcher-step-indicator',
  templateUrl: './step-indicator.component.html',
  styleUrls: ['./step-indicator.component.less']
})
export class StepIndicatorComponent implements OnInit {
  /**
   * Show appropriate style while steps are in progress of being shown
   *
   * @type {boolean}
   */
  @Input() inProgress: boolean = false;

  constructor(@Host() public wizardComponent: WizardComponent) {
  }

  ngOnInit() {
    this.restoreSummary();
  }

  // Steps

  /**
   * Navigate to next step
   */
  navToNextStep(): void {
    for (let i = 0; i < this.wizardComponent.steps.length; i++) {
      let step = this.wizardComponent.steps[i];
      if (step.completed !== true && step.hidden !== true) {
        this.navToStep(step.id);
        break;
      }
    }
  }

  /**
   * Navigate to step
   *
   * @param {string} id The step ID
   */
  navToStep(id: string) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => {
      // The onInViewportChange event doesn't always set the ID as expected
      this.wizardComponent.onInViewportChange(true, id);
    }, 10);
  }

  /**
   * Update application title for wizard component
   */
  updateAppTitle(): void {
    if (this.wizardComponent.summary !== undefined) {
      this.wizardComponent.summary.applicationTitle = this._applicationTitle;
    }
  }

  // Private

  // Restore mission & runtime summary
  private restoreSummary(): void {
    let selection: Selection = this.wizardComponent.selectionParams;
    if (selection === undefined) {
      return;
    }
    this.applicationTitle = selection.applicationTitle;
  }

  // Private

  // Restore mission & runtime summary
  private restoreSummary(): void {
    let selection: Selection = this.wizardComponent.selectionParams;
    if (selection === undefined) {
      return;
    }
    this.wizardComponent.summary.applicationTitle = selection.applicationTitle;
  }
}
