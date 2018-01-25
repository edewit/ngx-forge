import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { Selection } from './model/selection.model';
import { Summary } from './model/summary.model';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8launcher-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.less']
})
export class WizardComponent implements OnInit {

  selectedSection: string;

  private _summary: Summary;

  constructor(private router: Router) {
  }

  ngOnInit() {
    this._summary = {} as Summary;
  }

  onInViewportChange($event: boolean, id: string) {
    if ($event) {
      this.selectedSection = id;
    }
  }

  // add this back by listening to child events
  // selectSection(id: string) {
  //   document.getElementById(id).scrollIntoView({ behavior: 'smooth', block: 'start' });
  //   this.selectedSection = id;
  // }

  // Accessors

  /**
   * Returns current selection values needed to restore upon a redirect
   *
   * @returns {Selection} The current selection
   */
  get selection(): Selection {
    let selection = {
      missionId: this._summary.mission.missionId,
      runtimeId: this._summary.runtime.runtimeId,
      runtimeVersion: this._summary.runtime.version
    } as Selection;
    return selection;
  }

  /**
   * Returns current selection parameters, if any
   *
   * @returns {Selection} Current selection parameters or undefined
   */
  get selectionParams(): Selection {
    let userSelection: Selection;
    let selection = this.getRequestParam('selection');
    if (selection !== null) {
      userSelection = JSON.parse(selection);
    }
    return userSelection;
  }

  /**
   * Returns summary, including full Mission and Runtime objects
   *
   * @returns {Summary} The current user summary
   */
  get summary(): Summary {
    return this._summary;
  }

  /**
   * Set user summary
   *
   * @param {Summary} val The current user summary
   */
  set summary(summary: Summary) {
    this._summary = summary;
  }

  // Private

  /**
   * Helper to retrieve request parameters
   *
   * @param name The request parameter to retrieve
   * @returns {any} The request parameter value or null
   */
  private getRequestParam(name: string): string {
    let param = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(window.location.search);
    if (param !== null) {
      return decodeURIComponent(param[1]);
    }
    return null;
  }
}
