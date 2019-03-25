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
        { name: 'mavenArtifact', value: 'mavenArtifact' },
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

  unSetState(stepId: string) {
    delete this._state[stepId];
  }

  getState(stepId: string): StepState<T> {
    return this._state[stepId];
  }

  getSavedState(stepId: string): any {
    const state = this.searchParams().get(stepId);
    return JSON.parse(state);
  }

  restore(stepId: string, state: any): StepState<T> {
    const model = this.getSavedState(stepId);
    this._state[stepId].restore(state, model);
    return this._state[stepId];
  }

  resetState() {
    this._state = {};
  }

  get redirectUrl(): string {
    return window.location.href + this.toUrl();
  }

  toUrl(): string {
    return `?selectedSection=${encodeURIComponent(this._selectedSection)}&`
      + Object.keys(this._state).map(k =>
        `${encodeURIComponent(k)}=${encodeURIComponent('{'
          + this._state[k].save().map(o => this.stateToJsonPart(o))
          + '}')}`
      ).join('&');
  }

  toHttpPayload(): HttpParams {
    return new HttpParams({ fromObject: this.toJson });
  }

  get toJson(): any {
    const result: { [param: string]: string } = {};
    Object.keys(this._state).map(k =>
      this._state[k].save().map(f => {
        if (f.value) {
          result[f.name] = f.value;
        }
      })
    );
    return result;
  }

  private stateToJsonPart(o: any) {
    return `"${o.name}":${o.value ? JSON.stringify(o.value) : '""'}`;
  }

  /**
   * Angular doesn't use the searchParams part of the url, but appends the query string on the hash
   * this function converts to a URL object and uses that to create URLSearchParams.
   */
  protected searchParams(): URLSearchParams {
    const href = window.location.href;
    return new URL(href.substr(href.indexOf('?')), 'http://dummy').searchParams;
  }
}

export class StepState<T> {
  constructor(private _state: T, private _filters: Filter[]) { }

  save(): any {
    return this.filters.map(f => ({ name: f.name, value: _.get(this.state, f.value) }));
  }

  restore(collection, state) {
    this.filters.map(f => _.map(
      this.get(collection, this.basePath(f.restorePath ? f.restorePath : f.value)), e => {
        if (this.keyValue(e, f.value) === _.get(state, f.name)) {
          const basePath = this.basePath(f.value);
          if (basePath.length) {
            _.set(this.state, basePath, e);
          } else {
            _.merge(this.state, e);
          }
        }
      }));
  }

  /**
   * Specialised get that also gets things from collections
   * @example
   *    this.get({ bla: [{ test: [{ mission: 'ha' }, { mission: 'ga' }] }] }, 'bla.test.mission');
   *    // returns ["ha", "ga"]
   */
  private get(object: any, path: string | string[]) {
    if (typeof path === 'string') {
      path = path.split('.');
    }
    path.map(p => {
      if (_.isArray(object)) {
        object = _.flatten(_.map(object, p));
      } else {
        object = _.get(object, p);
      }
    });
    return object;
  }

  private keyValue(element: any, path: string) {
    return _.get(element, path.split('.').pop());
  }

  private basePath(path: string) {
    const basePath = path.split('.');
    basePath.pop();
    return basePath;
  }

  get state(): T {
    return this._state;
  }

  get filters(): Filter[] {
    return this._filters;
  }
}

export class Filter {
  constructor(public name: string, public value: string, public restorePath?: string) { }
}
