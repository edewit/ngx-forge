import { Injectable } from '@angular/core';
import { UserSelection } from '../../app/launcher/model/user-selection.model';
import { GitProviderService } from '../../app/launcher/launcher.module';

@Injectable()
export class DemoGitProviderService implements GitProviderService {

  constructor() {
  }

  authorize(val: UserSelection): void {
    console.log('In DemoGitProviderService' + this.getParams(val));
  }

  private getParams(val: UserSelection) {
    let params = '';
    if (val === undefined) {
      return params;
    }
    if (val.mission !== undefined && val.mission.missionId !== undefined) {
      params += 'missionId="' + val.mission.missionId + '"';
    }
    if (val.runtime !== undefined && val.runtime.runtimeId !== undefined) {
      params += '&runtimeId="' + val.runtime.runtimeId + '"';
    }
    if (val.runtime !== undefined && val.runtime.runtimeId !== undefined) {
      params += '&version="' + val.runtime.version + '"';
    }
    return (params.length > 0) ? '?' + params : params;
  }
}
