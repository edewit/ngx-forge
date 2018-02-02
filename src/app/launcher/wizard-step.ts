import { Input } from '@angular/core';

import { WizardComponent } from './wizard.component';

export abstract class WizardStep {
  /**
   * The step ID
   */
  @Input() id: string;

  /**
   * Flag indicating step has been completed
   */
  @Input() completed: boolean = false;

  /**
   * Flag indicating step is hidden
   */
  @Input() hidden: boolean = false;

  /**
   * A string array of steps that must be completed in order for this step to be shown -- overrides hidden
   */
  @Input() showAfterCompleted: string[];

  /**
   * Style class for the step container
   */
  @Input() styleClass: string;

  /**
   * Step title
   */
  @Input() title: string;

  constructor() {
  }
}
