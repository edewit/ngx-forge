import { Directive, forwardRef, Input } from '@angular/core';
import { AbstractControl, NG_ASYNC_VALIDATORS, Validator } from '@angular/forms';
import { Observable } from 'rxjs';

import { debounceTime, distinctUntilChanged, first } from 'rxjs/operators';
import { GitProviderService } from '../../service/git-provider.service';

@Directive({
  selector: '[validateRepository]',
  providers: [{ provide: NG_ASYNC_VALIDATORS, useExisting:
    forwardRef(() => GitProviderRepositoryValidatorDirective), multi: true }]
})
export class GitProviderRepositoryValidatorDirective implements Validator {
  private pattern = /^[a-zA-Z0-9][a-zA-Z0-9-._]{1,63}$/;

  @Input('validateRepository') missing: boolean;

  constructor(private gitProvider: GitProviderService) { }

  validate(control: AbstractControl): Observable<{ [key: string]: any }> {
    return this.validRepositoryName(control).pipe(debounceTime(500), distinctUntilChanged(), first());
  }

  validRepositoryName(control: AbstractControl): Observable<{ [key: string]: any }> {
    return new Observable((resolve) => {
      const valid = this.pattern.test(control.value);
      const org = control.parent.get('ghOrg').value;
      if (!valid) {
        resolve.next(this.createError('pattern', control.value));
      } else if (org) {
        this.gitProvider.isGitHubRepo(org, control.value).subscribe(
          duplicate => {
            if (duplicate && !this.missing) {
              resolve.next(this.createError('duplicate', control.value));
            } else if (!duplicate && this.missing) {
              resolve.next(this.createError('notExist', control.value));
            } else {
              resolve.next({});
            }
          }
        );
      }
    });
  }

  private createError(key: string, value: any): any {
    return { [key]: { value: value } };
  }
}
