import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { InViewportModule, WindowRef } from '@thisissoon/angular-inviewport';

import { PopoverModule } from 'ngx-bootstrap';
import { PipeModule } from 'patternfly-ng/pipe';

import { LauncherComponent } from '../../launcher.component';
import { LauncherStep } from '../../launcher-step';
import { MissionRuntimeCreateappStepComponent } from './mission-runtime-createapp-step.component';
import { MissionRuntimeService } from '../../service/mission-runtime.service';
import { BroadcastService } from '../../service/broadcast.service';
import { Mission } from '../../model/mission.model';
import { Runtime } from '../../model/runtime.model';
import { TestMissionRuntimeService } from '../../service/mission-runtime.service.spec';

export interface TypeWizardComponent {
  selectedSection: string;
  steps: LauncherStep[];
  summary: any;
  summaryCompleted: boolean;
  addStep(step: LauncherStep): void;
  onInViewportChange($event: any, id: string): any;
}

let mockWizardComponent: TypeWizardComponent = {
  selectedSection: '',
  steps: [],
  summary: {
    dependencyCheck: {},
    gitHubDetails: {}
  },
  summaryCompleted: false,
  addStep(step: LauncherStep) {
      for (let i = 0; i < this.steps.length; i++) {
        if (step.id === this.steps[i].id) {
          return;
        }
      }
      this.steps.push(step);
  },
  onInViewportChange($event: any, id: string) {
    if ($event) {
      setTimeout(() => {
        this.selectedSection = id;
      }, 10); // Avoids ExpressionChangedAfterItHasBeenCheckedError
    }
  }
};

describe('MissionRuntimeStepComponent', () => {
  let component: MissionRuntimeCreateappStepComponent;
  let fixture: ComponentFixture<MissionRuntimeCreateappStepComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        InViewportModule,
        PipeModule,
        PopoverModule.forRoot(),
        RouterTestingModule
      ],
      declarations: [
        MissionRuntimeCreateappStepComponent
      ],
      providers: [
        {
          provide: MissionRuntimeService, useClass: TestMissionRuntimeService
        },
        {
          provide: LauncherComponent, useValue: mockWizardComponent
        },
        BroadcastService,
        {
          provide: WindowRef, useValue: window
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MissionRuntimeCreateappStepComponent);
    component = fixture.componentInstance;
    // component.ngOnInit();
    fixture.detectChanges();
    element = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have 2 missions and 2 runtimes', () => {
    expect(component.missions.length).toBe(2, '2 missions');
    expect(component.runtimes.length).toBe(2, '2 runtimes');
    expect(element.querySelectorAll('.card-pf-body')[0].children.length).toBe(2, '2 missions displayed');
    expect(element.querySelectorAll('.card-pf-body')[1].children.length).toBe(2, '2 runtimes displayed');
  });

  // Missions tests

  it('should have visually selected the mission when click on radio button', fakeAsync(() => {
    fixture.detectChanges();
    let missionsSection = element.querySelectorAll('.card-pf-body')[0];
    let missionGroupItem = missionsSection.querySelector('.list-group-item');
    let radioBtn = <HTMLInputElement>missionGroupItem.querySelector('input[type="radio"]');
    let beforeChange = missionGroupItem.classList.contains('selected-list-item');
    radioBtn.click();
    tick();
    fixture.detectChanges();
    expect(beforeChange).toBeFalsy('Item must not be already selected');
    expect(missionGroupItem.classList.contains('selected-list-item')).toBeTruthy('Item has not been selected');
  }));

  it('should select the mission in launcher component summary', fakeAsync(() => {
    fixture.detectChanges();
    let missionsSection = element.querySelectorAll('.card-pf-body')[0];
    let missionGroupItem = missionsSection.querySelectorAll('.list-group-item')[1];
    let radioBtn = <HTMLInputElement>missionGroupItem.querySelector('input[type="radio"]');
    radioBtn.click();
    tick();
    fixture.detectChanges();
    expect(component.launcherComponent.summary.mission).toBe(component.missions[1] as Mission);
  }));

  it('should have the suggested missions tag when mission.suggested field is true', () => {
    let missionsSection = element.querySelectorAll('.card-pf-body')[0];
    let featuredTag = missionsSection.querySelector('.f8launcher-tags-label.suggested');
    expect(featuredTag).toBeDefined();
  });

  it('should not have the suggested missions tag when mission.suggested field is false', fakeAsync(() => {
    component.missions[1].suggested = false;
    fixture.detectChanges();
    tick();
    let missionsSection = element.querySelectorAll('.card-pf-body')[0];
    let missionGroupItem = missionsSection.querySelectorAll('.list-group-item')[1];
    let featuredTag = missionGroupItem.querySelector('.f8launcher-tags-label.suggested');
    expect(featuredTag).toBeNull();
  }));

  it('should have the prerequisite missions tag when mission.prerequisite field is present', () => {
    let missionsSection = element.querySelectorAll('.card-pf-body')[0];
    let featuredTag = missionsSection.querySelector('.f8launcher-tags-label.prerequisite');
    expect(featuredTag).toBeDefined();
  });

  it('should not have the prerequisite missions tag when mission.prerequisite field is absent', () => {
    delete component.missions[0].prerequisite;
    fixture.detectChanges();
    let missionsSection = element.querySelectorAll('.card-pf-body')[0];
    let featuredTag = missionsSection.querySelector('.f8launcher-tags-label.prerequisite');
    expect(featuredTag).toBeNull();
  });

  it('should have the mission name as specified', () => {
    let missionsSection = element.querySelectorAll('.card-pf-body')[0];
    let missionHead = missionsSection.querySelectorAll('.list-group-item-heading');
    let missions = component.missions, len = missions.length;
    for (let i = 0; i < len; ++ i) {
      expect((<HTMLDivElement>missionHead[i]).innerText.trim()).toBe(missions[i].name);
    }
  });

  it('should have the mission description as specified', () => {
    let missionsSection = element.querySelectorAll('.card-pf-body')[0];
    let missionHead = missionsSection.querySelectorAll('.list-group-item-text');
    let missions = component.missions, len = missions.length;
    for (let i = 0; i < len; ++ i) {
      expect((<HTMLDivElement>missionHead[i].children[0]).innerText.trim()).toBe(missions[i].description);
    }
  });

  it('should have the mission description truncated if the length is beyond 55 characters', fakeAsync(() => {
    let desc: string = 'this is a very lengthy description just to check the functionality of truncation';
    component.missions[0].description = desc;
    component.missions[1].description = desc;
    fixture.detectChanges();
    tick(500);
    let missionsSection = element.querySelectorAll('.card-pf-body')[0];
    let missionHead = missionsSection.querySelectorAll('.list-group-item-text');
    let missions = component.missions, len = missions.length;
    for (let i = 0; i < len; ++ i) {
      expect((<HTMLDivElement>missionHead[i].children[0]).innerText.trim()).toBe(desc.substr(0, 55) + '...');
    }
  }));

  it('should show "Less" if the showMore is true - Missions', () => {
    component.missions[0]['showMore'] = true;
    fixture.detectChanges();
    let missionsSection = element.querySelectorAll('.card-pf-body')[0];
    let showMore = <HTMLAnchorElement>missionsSection.querySelector('.description-more').children[0];
    expect(showMore.innerText.trim()).toBe('Less');
  });

  it('should show "More" if the showMore is false - Missions', () => {
    fixture.detectChanges();
    let missionsSection = element.querySelectorAll('.card-pf-body')[0];
    let showMore = <HTMLAnchorElement>missionsSection.querySelector('.description-more').children[0];
    expect(showMore.innerText.trim()).toBe('More');
  });

  it('should disable the runtimes, on click of mission, which aren\'t applicable', fakeAsync(() => {
    fixture.detectChanges();
    let missionsSection = element.querySelectorAll('.card-pf-body')[0];
    let missionGroupItem = missionsSection.querySelectorAll('.list-group-item')[1];
    let radioBtn = <HTMLInputElement>missionGroupItem.querySelector('input[type="radio"]');
    radioBtn.click();
    tick();
    fixture.detectChanges();
    expect(component.runtimes[1].disabled).toBeTruthy();
  }));

  // Runtimes tests

  it('should have visually selected the runtime when click on radio button', fakeAsync(() => {
    fixture.detectChanges();
    let missionsSection = element.querySelectorAll('.card-pf-body')[1];
    let missionGroupItem = missionsSection.querySelector('.list-group-item');
    let radioBtn = <HTMLInputElement>missionGroupItem.querySelector('input[type="radio"]');
    let beforeChange = missionGroupItem.classList.contains('selected-list-item');
    radioBtn.click();
    tick();
    fixture.detectChanges();
    expect(beforeChange).toBeFalsy('Item must not be already selected');
    expect(missionGroupItem.classList.contains('selected-list-item')).toBeTruthy('Item has not been selected');
  }));

  it('should select the runtime in launcher component summary', fakeAsync(() => {
    fixture.detectChanges();
    let runtimesSection = element.querySelectorAll('.card-pf-body')[1];
    let runtimeGroupItem = runtimesSection.querySelectorAll('.list-group-item')[1];
    let radioBtn = <HTMLInputElement>runtimeGroupItem.querySelector('input[type="radio"]');
    radioBtn.click();
    tick();
    fixture.detectChanges();
    expect(component.launcherComponent.summary.runtime).toBe(component.runtimes[1] as Runtime);
  }));


  it('should have the suggested runtimes tag when runtime.suggested field is true', () => {
    let runtimesSection = element.querySelectorAll('.card-pf-body')[1];
    let featuredTag = runtimesSection.querySelector('.f8launcher-tags-label.suggested');
    expect(featuredTag).toBeDefined();
  });

  it('should not have the suggested runtimes tag when runtime.suggested field is false', () => {
    component.runtimes[1].suggested = false;
    fixture.detectChanges();
    let runtimesSection = element.querySelectorAll('.card-pf-body')[1];
    let runtimeGroupItem = runtimesSection.querySelectorAll('.list-group-item')[1];
    let featuredTag = runtimeGroupItem.querySelector('.f8launcher-tags-label.suggested');
    expect(featuredTag).toBeNull();
  });

  it('should have the prerequisite runtimes tag when runtime.prerequisite field is present', () => {
    let runtimesSection = element.querySelectorAll('.card-pf-body')[1];
    let featuredTag = runtimesSection.querySelector('.f8launcher-tags-label.prerequisite');
    expect(featuredTag).toBeDefined();
  });

  it('should not have the prerequisite runtimes tag when runtime.prerequisite field is absent', () => {
    delete component.runtimes[0].prerequisite;
    fixture.detectChanges();
    let runtimesSection = element.querySelectorAll('.card-pf-body')[1];
    let runtimeGroupItem = runtimesSection.querySelectorAll('.list-group-item')[0];
    let featuredTag = runtimeGroupItem.querySelector('.f8launcher-tags-label.prerequisite');
    expect(featuredTag).toBeNull();
  });

  it('should have the runtime name as specified', () => {
    let runtimesSection = element.querySelectorAll('.card-pf-body')[1];
    let runtimesHead = runtimesSection.querySelectorAll('.list-group-item-heading');
    let runtimes = component.runtimes, len = runtimes.length;
    for (let i = 0; i < len; ++ i) {
      expect((<HTMLDivElement>runtimesHead[i]).childNodes[0].textContent.trim()).toBe(runtimes[i].name);
    }
  });

  it('should have the runtime description as specified', () => {
    let runtimesSection = element.querySelectorAll('.card-pf-body')[1];
    let runtimesHead = runtimesSection.querySelectorAll('.list-group-item-text');
    let runtimes = component.runtimes, len = runtimes.length;
    for (let i = 0; i < len; ++ i) {
      expect((<HTMLDivElement>runtimesHead[i].children[0]).innerText.trim()).toBe(runtimes[i].description);
    }
  });

  it('should have the runtime description truncated if the length is beyond 55 characters', () => {
    let desc: string = 'this is a very lengthy description just to check the functionality of truncation';
    component.runtimes[0].description = desc;
    component.runtimes[1].description = desc;
    fixture.detectChanges();
    let runtimesSection = element.querySelectorAll('.card-pf-body')[1];
    let runtimesHead = runtimesSection.querySelectorAll('.list-group-item-text');
    let runtimes = component.runtimes, len = runtimes.length;
    for (let i = 0; i < len; ++ i) {
      expect((<HTMLDivElement>runtimesHead[i].children[0]).innerText.trim()).toBe(desc.substr(0, 55) + '...');
    }
  });

  it('should show "Less" if the showMore is true - Runtimes', () => {
    component.runtimes[0].showMore = true;
    fixture.detectChanges();
    let runtimesSection = element.querySelectorAll('.card-pf-body')[1];
    let showMore = <HTMLAnchorElement>runtimesSection.querySelector('.description-more').children[0];
    expect(showMore.innerText.trim()).toBe('Less');
  });

  it('should show "More" if the showMore is false - Runtimes', () => {
    fixture.detectChanges();
    let runtimesSection = element.querySelectorAll('.card-pf-body')[1];
    let showMore = <HTMLAnchorElement>runtimesSection.querySelector('.description-more').children[0];
    expect(showMore.innerText.trim()).toBe('More');
  });
});
