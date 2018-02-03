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
