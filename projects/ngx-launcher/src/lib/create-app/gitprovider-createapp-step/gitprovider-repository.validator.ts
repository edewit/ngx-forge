import { Directive, forwardRef } from '@angular/core';
import { NG_ASYNC_VALIDATORS, Validator, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';

import { GitProviderService } from '../../service/git-provider.service';
import { debounceTime, distinctUntilChanged, first } from 'rxjs/operators';

@Directive({
  selector: '[validateRepository]',
  providers: [{ provide: NG_ASYNC_VALIDATORS, useExisting:
    forwardRef(() => GitProviderRepositoryValidatorDirective), multi: true }]
})
export class GitProviderRepositoryValidatorDirective implements Validator {
  private pattern = /^[a-zA-Z0-9][a-zA-Z0-9-._]{1,63}$/;

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
          duplicate => resolve.next(duplicate ? this.createError('duplicate', control.value) : {})
        );
      }
    });
  }

  private createError(key: string, value: any): any {
    return { [key]: { value: value } };
  }
}
