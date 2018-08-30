import { ValidatorFn, AbstractControl, NG_VALIDATORS, Validator } from '@angular/forms';
import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[existingRepository]',
  providers: [{provide: NG_VALIDATORS, useExisting: ExistingRepositoryValidatorDirective, multi: true}]
})
export class ExistingRepositoryValidatorDirective implements Validator {
  @Input('existingRepository') repoList: string[];

  validate(control: AbstractControl): {[key: string]: any} | null {
    return this.repoList ? repositoryValidator(this.repoList)(control) : null;
  }
}

export function repositoryValidator(repoList: string[]): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const existingRepo = repoList.indexOf(control.value) !== -1;
    return existingRepo ? null : { 'notExist': { value: control.value } };
  };
}
