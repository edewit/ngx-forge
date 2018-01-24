import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

import { UserSelection } from './model/user-selection.model';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8launcher-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.less']
})
export class WizardComponent implements OnInit {

  selectedSection: string;

  private _userSelection: UserSelection;

  ngOnInit() {
    this._userSelection = {
      mission: {
        'missionId': 'BasicApplication',
        'suggested': true,
        'title': 'Basic Application',
        'description': 'Brief description of the Basic Application mission and what it does.',
        'supportedRuntimes': []
      },
      runtime: {
        'runtimeId': 'SpringBoot',
        'title': 'Spring Boot',
        'description': 'Brief description of the technology...',
        'logo': '../../../assets/images/spring-boot-logo.png',
        'supportedMissions': [],
        'version': 'v1.0.0',
        'versions': ['v1.0.0', 'v1.0.1', 'v2.0.1']
      }
    } as UserSelection;
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

  get userSelection(): UserSelection {
    return this._userSelection;
  }

  set userSelection(val: UserSelection) {
    this._userSelection = val;
  }
}
