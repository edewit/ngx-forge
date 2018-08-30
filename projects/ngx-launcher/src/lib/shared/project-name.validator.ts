import { Directive, forwardRef } from '@angular/core';
import { NG_ASYNC_VALIDATORS, Validator, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';

import { DependencyCheckService } from '../service/dependency-check.service';
import { debounceTime, distinctUntilChanged, first } from 'rxjs/operators';

@Directive({
  selector: '[validateProjectName]',
  providers: [{ provide: NG_ASYNC_VALIDATORS, useExisting:
    forwardRef(() => ProjectNameValidatorDirective), multi: true }]
})
export class ProjectNameValidatorDirective implements Validator {
  // allows only '-', '_' and 4-40 characters (must start with alphabetic and end with alphanumeric)
  // no continuous '-' or '_' is allowed
  public static readonly pattern = new RegExp('^[a-zA-Z](?!.*--)(?!.*__)[a-zA-Z0-9-_]{2,38}[a-zA-Z0-9]$');

  constructor(private dependencyCheckService: DependencyCheckService) { }

  validate(control: AbstractControl): Observable<{ [key: string]: any }> {
    return this.validRepositoryName(control.value).pipe(
      debounceTime(500),
      distinctUntilChanged(),
      first()
    );
  }

  validRepositoryName(value: any): Observable<{ [key: string]: any }> {
    return new Observable((resolve) => {
      const valid = ProjectNameValidatorDirective.pattern.test(value);
      if (!valid) {
        resolve.next(this.createError('pattern', value));
      } else {
        this.dependencyCheckService.getApplicationsInASpace().subscribe(apps => {
          const applicationNames = apps.map(
            app => app.attributes.name ? (<string>app.attributes.name).toLowerCase() : ''
          );
          resolve.next(applicationNames.indexOf(value) !== -1 ? this.createError('duplicate', value) : {});
        });
      }
    });
  }

  private createError(key: string, value: any): any {
    return { [key]: { value: value } };
  }
}
