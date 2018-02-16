import { Input } from '@angular/core';

export abstract class LauncherStep {
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
