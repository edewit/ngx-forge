import { Input, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { LauncherComponent } from './launcher.component';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

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
  @Input() hidden: boolean = false;

  /**
   * Flag indicating step is optional
   */
  @Input() optional: boolean = false;

  /**
   * Style class for the step container
   */
  @Input() styleClass: string;

  /**
   * Step title
   */
  @Input() title: string;

  @ViewChild('section') element: ElementRef;

  protected _launcherComponent: LauncherComponent;

  private scrollEvents: Subscription = fromEvent(window, 'scroll').pipe(debounceTime(100)).subscribe(() => this.isInView());

  constructor(launcherComponent: LauncherComponent) {
    this._launcherComponent = launcherComponent;
  }

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
        this._launcherComponent.onInViewportChange(this.id);
      }
    }
  }
}
