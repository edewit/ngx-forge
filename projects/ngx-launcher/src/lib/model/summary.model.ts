import { Injectable } from '@angular/core';
import { Cluster } from './cluster.model';
import { DependencyCheck } from './dependency-check.model';
import { GitHubDetails } from './github-details.model';
import { Mission } from './mission.model';
import { Runtime } from './runtime.model';
import { Pipeline } from './pipeline.model';
import { DependencyEditor } from './dependency-editor/dependency-editor.model';

@Injectable()
export class Projectile {
  private _details = {};
  cluster?: Cluster;
  dependencyCheck: DependencyCheck;
  dependencyEditor?: DependencyEditor;
  gitHubDetails?: GitHubDetails;
  mission: Mission;
  organization: string;
  pipeline: Pipeline;
  runtime: Runtime;
  targetEnvironment: string;

  constructor() {}

  getDetails(stepId: string) {
    return this._details[stepId];
  }

  setDetails(stepId: string, data: any) {
    this._details[stepId] = data;
  }

  getSavedState(stepId: string): any {
    const state = new URL(window.location.href).searchParams.get(stepId);
    return JSON.parse(state);
  }

  get redirectUrl(): string {
    return new URL(this.toString(), window.location.href).toString();
  }

  toString(): string {
    return '?' + Object.keys(this._details)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(JSON.stringify(this._details[key]))}`).join('&');
  }
}
