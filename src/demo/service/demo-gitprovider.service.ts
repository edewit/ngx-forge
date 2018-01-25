import { Injectable } from '@angular/core';

import { Selection } from '../../app/launcher/model/selection.model';
import { GitProviderService } from '../../app/launcher/launcher.module';

@Injectable()
export class DemoGitProviderService implements GitProviderService {
  private clientId: string = 'a59372e52d3128f59dfb'; // Test app

  constructor() {
  }

  authorize(redirectUrl: string): void {
    let url = 'https://github.com/login/oauth/authorize?client_id=' + this.clientId +
      '&redirect_uri=' + encodeURIComponent(redirectUrl);
    this.redirectToAuth(url);
  }

  private getParams(selection: Selection) {
    return '?selection=' + JSON.stringify(selection);
  }

  private redirectToAuth(url: string) {
    console.log('DemoGitProviderService.redirectToAuth: ' + url);
    window.location.href = url;
  }
}
