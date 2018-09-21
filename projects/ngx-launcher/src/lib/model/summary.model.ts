import { Injectable } from '@angular/core';
import { Cluster } from './cluster.model';
import { DependencyCheck } from './dependency-check.model';
import { GitHubDetails } from './github-details.model';
import { Mission } from './mission.model';
import { Runtime } from './runtime.model';
import { Pipeline } from './pipeline.model';
import { DependencyEditor } from './dependency-editor/dependency-editor.model';

import * as _ from 'lodash';

@Injectable()
export class Projectile<T> {
  private _state = {};
  selectedSection: string;

  cluster?: Cluster;
  dependencyCheck: DependencyCheck;
  dependencyEditor?: DependencyEditor;
  gitHubDetails?: GitHubDetails;
  mission: Mission;
  organization: string;
  pipeline: Pipeline;
  runtime: Runtime;
  targetEnvironment: string;

  setState(stepId: string, state: StepState<T>) {
    this._state[stepId] = state;
  }

  getState(stepId: string): StepState<T> {
    return this._state[stepId];
  }

  getSavedState(stepId: string): any {
    const state = new URL(window.location.href).searchParams.get(stepId);
    return JSON.parse(state);
  }

  get redirectUrl(): string {
    const url = new URL(this.toUrl(), window.location.href);
    url.hash = window.location.hash;
    return url.toString();
  }

  toUrl(): string {
    return '?' + Object.keys(this._state).map(k => {
      this._state[k].save();
      return `${encodeURIComponent(k)}=${encodeURIComponent('{' +
        this._state[k].filters.map(f => `"${f.name}":${JSON.stringify(_.get(this._state[k].state, f.value, ''))}`) + '}')}`;
    }).join('&');
  }
}

export class StepState<T> {
  constructor(private _state: T, private _filters: Filter[]) {}

  save(): any {
    return this.filters.map(f => ({ name: f.name, value: _.get(this.state, f.value) }));
  }

  get state(): T {
    return this._state;
  }

  get filters(): Filter[] {
    return this._filters;
  }
}

export class Filter {
  constructor(public name: string, public value: string) {}
}
