import { Input, ViewChild, ElementRef, OnDestroy, Type } from '@angular/core';
import { LauncherComponent } from './launcher.component';
import { ReviewComponent } from './review.component';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { Projectile } from './model/summary.model';
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

  constructor(private _reviewComponentType: Type<ReviewComponent>,
    private _projectile: Projectile<any>) {}

  get reviewComponentType(): Type<ReviewComponent> {
    return this._reviewComponentType;
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
