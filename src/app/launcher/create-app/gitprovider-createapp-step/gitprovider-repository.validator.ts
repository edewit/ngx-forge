import { Directive } from '@angular/core';
import { NG_ASYNC_VALIDATORS, Validator, ValidatorFn, AbstractControl } from '@angular/forms';

import { GitProviderService } from '../../service/git-provider.service';

@Directive({
  selector: '[validateRepository]',
  providers: [{provide: NG_ASYNC_VALIDATORS, useExisting: GitProviderRepositoryValidatorDirective, multi: true}]
})
export class GitProviderRepositoryValidatorDirective implements Validator {
  private pattern = /^[a-zA-Z0-9][a-zA-Z0-9-._]{1,63}$/;

  constructor(private gitProvider: GitProviderService) {}

  validate( control : AbstractControl ) : Promise<{[key : string] : any}> {
    return this.validRepositoryName(control);
  }

  validRepositoryName(control: AbstractControl): Promise<{[key : string] : any}> {
    return new Promise(resolve => {
      const valid = this.pattern.test(control.value);
      const org = control.parent.get("ghOrg").value;
      if (!valid) {
        resolve(this.createError(control.value, 'pattern', valid));
      } else if (org) {
        this.gitProvider.isGitHubRepo(org, control.value).subscribe(
          duplicate => resolve(this.createError(control.value, 'duplicate', !duplicate))
        );
      }
    });
  }

  private createError(value: any, key: string, valid: boolean): any {
    return valid ? null : {[key]: {value: value}};
  }
}
