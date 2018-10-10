import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import * as _ from 'lodash';

import { DependencyCheck } from './dependency-check.model';

@Injectable()
export class Projectile<T> {
  private _state = {};
  private _selectedSection = '';

  get selectedSection(): string {
    if (!this._selectedSection) {
      this._selectedSection = this.searchParams().get('selectedSection');
    }
    return this._selectedSection;
  }

  set selectedSection(selectedSection: string) {
    this._selectedSection = selectedSection;
  }

  get sharedState(): StepState<DependencyCheck> {
    let state = this._state['shared'];
    if (!state) {
      const dependencyCheck = this.getSavedState('shared') || new DependencyCheck();
      state = new StepState<DependencyCheck>(dependencyCheck, [
        { name: 'projectName', value: 'projectName' },
        { name: 'projectVersion', value: 'projectVersion' },
        { name: 'groupId', value: 'groupId' },
        { name: 'artifactId', value: 'artifactId' },
        { name: 'spacePath', value: 'spacePath' },
        { name: 'targetEnvironment', value: 'targetEnvironment' }
      ]);
      this.setState('shared', state);
    }
    return state;
  }

  setState(stepId: string, state: StepState<T>) {
    this._state[stepId] = state;
  }

  getState(stepId: string): StepState<T> {
    return this._state[stepId];
  }

  getSavedState(stepId: string): any {
    const state = this.searchParams().get(stepId);
    return JSON.parse(state);
  }

  get redirectUrl(): string {
    const url = new URL(this.toUrl(), window.location.href);
    url.hash = window.location.hash;
    return url.toString();
  }

  toUrl(): string {
    return `?selectedSection=${encodeURIComponent(this._selectedSection)}&`
      + Object.keys(this._state).map(k => {
        this._state[k].save();
        return `${encodeURIComponent(k)}=${encodeURIComponent('{' +
          this._state[k].filters.map((f: Filter) => this.stateToJsonPart(f, this._state[k].state)) + '}')}`;
      }).join('&');
  }

  toHttpPayload(): HttpParams {
    const params = new HttpParams();
    Object.keys(this._state).map(k => {
      this._state[k].save();
      Object.keys(this._state[k].state)
        .map(e => params.append(e, this._state[k].state[e]));
    });
    return params;
  }

  private stateToJsonPart(f: Filter, state: any) {
    return `"${f.name}":${JSON.stringify(_.get(state, f.value, ''))}`;
  }

  protected searchParams(): URLSearchParams {
    return new URL(window.location.href).searchParams;
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
