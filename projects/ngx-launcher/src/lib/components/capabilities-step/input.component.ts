import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { DefaultValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, first } from 'rxjs/operators';

@Component({
  selector: 'f8launcher-input',
  templateUrl: './input.component.html',
  //styleUrls: ['./input.component.less'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      // tslint:disable-next-line:no-forward-ref
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
})
export class InputComponent extends DefaultValueAccessor implements OnInit {
  @Input('ngModel') input;
  //@Input() messages: [];
  @Input() changeOnKey: boolean;

  protected keyUp = new Subject<string>();

  ngOnInit() {
    if (this.changeOnKey) {
      this.keyUp.asObservable().pipe(
        debounceTime(1000), distinctUntilChanged(), first())
        .subscribe((data) => {
          this.onChange(data);
        });
    }
  }

  writeValue(obj: any): void {
    if (obj && obj.value) {
      this.input.value = obj.value;
    }
    super.writeValue(obj);
  }

  change() {
    if (!this.changeOnKey) {
      this.onChange(this.input.value);
    }
  }

  // messageForInput(name: string): any {
  //   let result;
  //   if (!this.messages) {
  //     return null;
  //   }
  //   for (let message of this.messages) {
  //     if (message.input === name) {
  //       result = message;
  //     }
  //   }
  //   return result;
  // }
}
