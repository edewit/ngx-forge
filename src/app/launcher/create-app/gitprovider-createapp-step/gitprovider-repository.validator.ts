import { Directive } from '@angular/core';
import { NG_ASYNC_VALIDATORS, Validator, ValidatorFn, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';

import { GitProviderService } from '../../service/git-provider.service';

@Directive({
  selector: '[validateRepository]',
  providers: [{provide: NG_ASYNC_VALIDATORS, useExisting: GitProviderRepositoryValidatorDirective, multi: true}]
})
export class GitProviderRepositoryValidatorDirective implements Validator {
  private pattern = /^[a-zA-Z0-9][a-zA-Z0-9-._]{1,63}$/;

  constructor(private gitProvider: GitProviderService) {}

  validate( control : AbstractControl ) : Observable<{[key : string] : any}> {
    return Observable.timer(500).switchMap(()=>{
        return this.validRepositoryName(control)
        .mapTo(null)
        .catch(err=>Observable.of({availability: true}));
    });
  }

  validRepositoryName(control: AbstractControl): Observable<{[key : string] : any}> {
    return new Observable((resolve) => {
      const valid = this.pattern.test(control.value);
      const org = control.parent.get("ghOrg").value;
      if (!valid) {
        resolve.next(this.createError(control.value, 'pattern', valid));
      } else if (org) {
        this.gitProvider.isGitHubRepo(org, control.value).subscribe(
          duplicate => resolve.next(this.createError(control.value, 'duplicate', !duplicate))
        );
      }
    });
  }

  private createError(value: any, key: string, valid: boolean): any {
    return valid ? null : {[key]: {value: value}};
  }
}
