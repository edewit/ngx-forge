import { Injectable } from '@angular/core';

@Injectable()
export class Config {
  protected settings: any;

  load(): Promise<any> {
    return Promise.resolve();
  }

  set(settings: any) {
    this.settings = settings;
  }

  get(key: string): string {
    return this.settings[key];
  }
}
