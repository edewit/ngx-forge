import { ElementRef, Input, OnDestroy, Type, ViewChild } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Projectile } from './model/projectile.model';

export abstract class LauncherStep implements OnDestroy {
  /**
   * The step ID
   */
  @Input() id: string;

  /**
   * Flag indicating step has been completed
   */
  abstract get completed(): boolean;

  /**
   * Flag indicating step is hidden
   */
  @Input() hidden: boolean;

  /**
   * Flag indicating step is optional
   */
  @Input() optional: boolean;

  /**
   * Style class for the step container
   */
  @Input() styleClass: string;

  /**
   * Step title
   */
  @Input() title: string;

  @ViewChild('section') element: ElementRef;

  private scrollEvents: Subscription = fromEvent(window, 'scroll').pipe(debounceTime(100)).subscribe(() => this.isInView());

  constructor(private _projectile: Projectile<any>) {}

  ngOnDestroy(): void {
    this.scrollEvents.unsubscribe();
  }

  isInView(): void {
    if (this.element) {
      const nativeElement = this.element.nativeElement;
      const elementTop = nativeElement.getBoundingClientRect().top;
      const elementBottom = elementTop + nativeElement.getBoundingClientRect().height;

      const viewportTop = window.innerHeight || document.documentElement.clientHeight;

      const inView = elementBottom !== 0 && elementTop <= viewportTop;
      if (inView) {
        this._projectile.selectedSection = this.id;
      }
    }
  }

  restore(): void {
    const state = this._projectile.getSavedState(this.id);
    if (state) {
      this.restoreModel(state);
    }
  }

  abstract restoreModel(model: any): void;
}
