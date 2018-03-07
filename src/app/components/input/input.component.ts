import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/of';
import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { Input as ForgeInput, Message } from '../../model/base.model';
import { DefaultValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IMultiSelectSettings } from 'angular-2-dropdown-multiselect';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'la-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.less'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
})
export class InputComponent extends DefaultValueAccessor implements OnInit {
  @Input('ngModel') input: ForgeInput;
  @Input() messages: Message[];
  @Input() changeOnKey: boolean;

  protected keyUp = new Subject<string>();

  searchMultiSelectSettings: IMultiSelectSettings = {
    enableSearch: true,
    checkedStyle: 'glyphicon',
    showUncheckAll: true
  };

  ngOnInit() {
    if (this.changeOnKey) {
      this.keyUp.asObservable()
        .debounceTime(1000).distinctUntilChanged()
        .flatMap((search) => {
          return Observable.of(search).delay(500);
        }).subscribe((data) => {
          this.onChange(data);
        });
    }
  }

  writeValue(obj: ForgeInput): void {
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

  messageForInput(name: string): Message {
    let result: Message;
    if (!this.messages) return null;
    for (let message of this.messages) {
      if (message.input === name) {
        result = message;
      }
    }
    return result;
  }

  convertToOptions(options: string[]): any[] {
    let result: any[] = [];
    for (let option of options) {
      result.push({ id: option, name: option });
    }
    return result;
  }
}

