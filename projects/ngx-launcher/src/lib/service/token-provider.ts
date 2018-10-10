import { Injectable } from '@angular/core';

@Injectable()
export class TokenProvider {
  getToken(): string | Promise<string> {
    return '';
  }

  getGitHubToken(): string | Promise<string> {
    return '';
  }

  isPromise(token: string | Promise<string>): token is Promise<string> {
    return (<Promise<string>> token).then !== undefined;
  }

  get token(): Promise<string> {
    const token = this.getToken();
    if (this.isPromise(token)) {
      return token;
    } else {
      return Promise.resolve(token);
    }
  }

  get gitHubToken(): Promise<string> {
    const token = this.getGitHubToken();
    if (this.isPromise(token)) {
      return token;
    } else {
      return Promise.resolve(token);
    }
  }
}
