import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { Broadcaster } from 'ngx-base';
import { BsDropdownModule, PopoverModule } from 'ngx-bootstrap';
import { SortArrayPipeModule, TruncatePipeModule } from 'patternfly-ng/pipe';

import { Observable, of } from 'rxjs';
import { Catalog } from '../../model/catalog.model';
import { Mission } from '../../model/mission.model';
import { Projectile } from '../../model/projectile.model';
import { Runtime } from '../../model/runtime.model';
import { MissionRuntimeService } from '../../service/mission-runtime.service';
import { createBooster, createMission, createRuntime } from '../../service/mission-runtime.service.spec';
import { ButtonNextStepComponent } from '../../shared/button-next-step.component';
import { BroadcasterTestProvider } from '../targetenvironment-step/target-environment-step.component.spec';
import { MissionRuntimeStepComponent } from './mission-runtime-step.component';


const longDescription = `An innovative approach to packaging and running Java EE applications,
 packaging them with just enough of the server runtime to "java -jar" your application`;

class TestMissionRuntimeService extends MissionRuntimeService {

  public catalog: Catalog = {
    missions: [
      createMission('crud'),
      createMission('healthcheck')
    ],
    runtimes: [
      createRuntime('vert.x', ['community', 'redhat']),
      createRuntime('nodejs', ['community', 'redhat'])
    ],
    boosters: [
      createBooster('crud', 'vert.x', 'community'),
      createBooster('crud', 'vert.x', 'redhat'),
      createBooster('crud', 'nodejs', 'redhat'),
      createBooster('healthcheck', 'vert.x', 'community')
    ]
  };

  getCatalog(): Observable<Catalog> {
    return of(this.catalog);
  }
}

describe('MissionRuntimeStepComponent', () => {
  let component: MissionRuntimeStepComponent;
  let fixture: ComponentFixture<MissionRuntimeStepComponent>;
  let element: HTMLElement;

  function getMissionsSection(): Element {
    return element.querySelectorAll('.card-pf-body')[0];
  }

  function getMissionItem(index: number): Element {
    return getMissionsSection().querySelectorAll('.list-group-item')[index];
  }

  function getRuntimesSection(): Element {
    return element.querySelectorAll('.card-pf-body')[1];
  }

  function getRuntimeItem(index: number): Element {
    return getRuntimesSection().querySelectorAll('.list-group-item')[index];
  }

  function selectItem(item: Element) {
    const radioBtn = <HTMLInputElement> item.querySelector('input[type="radio"]');
    radioBtn.click();
    tick();
    fixture.detectChanges();
  }

  function isItemSelected(item: Element): boolean {
    return item.classList.contains('selected-list-item');
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BsDropdownModule.forRoot(),
        FormsModule,
        CommonModule,
        FormsModule,
        PopoverModule.forRoot(),
        RouterTestingModule,
        SortArrayPipeModule,
        TruncatePipeModule
      ],
      declarations: [
        MissionRuntimeStepComponent,
        ButtonNextStepComponent
      ],
      providers: [
        Projectile,
        {
          provide: MissionRuntimeService, useClass: TestMissionRuntimeService
        },
        { provide: Broadcaster, useValue: BroadcasterTestProvider.broadcaster }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MissionRuntimeStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    element = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have 2 missions and 2 runtimes', () => {
    expect(component.missions.length).toBe(2, '2 missions');
    expect(component.runtimes.length).toBe(2, '2 runtimes');
    expect(getMissionsSection().children.length).toBe(2, '2 missions displayed');
    expect(getRuntimesSection().children.length).toBe(2, '2 runtimes displayed');
  });

  // Missions tests

  it('should have visually selected the mission when click on radio button', fakeAsync(() => {
    fixture.detectChanges();

    const missionItem = getMissionItem(0);
    expect(isItemSelected(missionItem)).toBeFalsy('Item must not be already selected');
    selectItem(missionItem);
    expect(isItemSelected(missionItem)).toBeTruthy('Item has not been selected');
  }));

  it('should select the mission in launcher component summary', fakeAsync(() => {
    fixture.detectChanges();
    selectItem(getMissionItem(0));
    expect(component.booster.mission.id).toBe((component.missions[0] as Mission).id);

    selectItem(getMissionItem(1));
    expect(component.booster.mission.id).toBe((component.missions[1] as Mission).id);
  }));

  it('should have the suggested missions tag when mission.suggested field is true', () => {
    expect(getMissionsSection().querySelector('.f8launcher-tags-label.suggested')).toBeDefined();
  });

  it('should not have the suggested missions tag when mission.suggested field is false', fakeAsync(() => {
    component.missions[1].suggested = false;
    fixture.detectChanges();
    tick();
    expect(getMissionItem(1).querySelector('.f8launcher-tags-label.suggested')).toBeNull();
  }));

  it('should have the prerequisite missions tag when mission.prerequisite field is present', () => {
    expect(getMissionsSection().querySelector('.f8launcher-tags-label.prerequisite')).toBeDefined();
  });

  it('should not have the prerequisite missions tag when mission.prerequisite field is absent', () => {
    delete component.missions[0].prerequisite;
    fixture.detectChanges();
    expect(getMissionItem(0).querySelector('.f8launcher-tags-label.prerequisite')).toBeNull();
  });

  it('should have the mission name as specified', () => {
    const missionsSection = getMissionsSection();
    const missionHead = missionsSection.querySelectorAll('.list-group-item-heading');
    const missions = component.missions, len = missions.length;
    for (let i = 0; i < len; ++ i) {
      expect((<HTMLDivElement> missionHead[i]).innerText.trim()).toBe(missions[i].name);
    }
  });

  it('should have the mission description as specified', () => {
    const missionsSection = getMissionsSection();
    const missionText = missionsSection.querySelectorAll('.list-group-item-text');
    const missions = component.missions, len = missions.length;
    for (let i = 0; i < len; ++ i) {
      expect((<HTMLDivElement> missionText[i].children[0]).innerText.trim()).toBe(missions[i].description);
    }
  });

  it('should have the mission description truncated if the length is beyond 65 characters', fakeAsync(() => {
    component.missions[0].description = longDescription;
    component.missions[1].description = longDescription;
    fixture.detectChanges();
    tick(500);
    const missionsSection = getMissionsSection();
    const missionText = missionsSection.querySelectorAll('.list-group-item-text');
    const missions = component.missions, len = missions.length;
    for (let i = 0; i < len; ++ i) {
      expect((<HTMLDivElement> missionText[i].children[0]).innerText.trim())
      .toBe(longDescription.substr(0, 65) + '...');
    }
  }));

  it('should handle mission show more/less correctly', fakeAsync(() => {
    component.missions[0].description = longDescription;
    tick(500);
    fixture.detectChanges();
    const missionItem1 = getMissionItem(0);
    expect(missionItem1.querySelector('.description.truncated')).toBeTruthy();
    expect(missionItem1.querySelector('.description.full')).toBeFalsy();
    const showMore = <HTMLAnchorElement> missionItem1.querySelector('.description-more a');
    expect(showMore.innerText.trim()).toBe('More');
    showMore.click();
    tick();
    fixture.detectChanges();
    expect(showMore.innerText.trim()).toBe('Less');
    expect(missionItem1.querySelector('.description.truncated')).toBeFalsy();
    expect(missionItem1.querySelector('.description.full')).toBeTruthy();

    const missionItem2 = getMissionItem(1);
    expect(missionItem2.querySelector('.description.truncated')).toBeTruthy();
    expect(missionItem2.querySelector('.description.full')).toBeFalsy();
    expect(missionItem2.querySelector('.description-more a')).toBeFalsy();
  }));

  it('should disable the runtimes, on click of mission, which aren\'t applicable', fakeAsync(() => {
    fixture.detectChanges();
    selectItem(getMissionItem(1));
    expect(component.runtimes[1].disabled).toBeTruthy();
  }));

  // Runtimes tests

  it('should have visually selected the runtime when click on radio button', fakeAsync(() => {
    fixture.detectChanges();

    const runtimeItem = getRuntimeItem(0);
    expect(isItemSelected(runtimeItem)).toBeFalsy('Item must not be already selected');
    selectItem(runtimeItem);
    expect(isItemSelected(runtimeItem)).toBeTruthy('Item has not been selected');
  }));

  it('should select the runtime in launcher component summary', fakeAsync(() => {
    fixture.detectChanges();
    selectItem(getRuntimeItem(0));
    expect(component.booster.runtime.id).toBe((component.runtimes[0] as Runtime).id);

    selectItem(getRuntimeItem(1));
    expect(component.booster.runtime.id).toBe((component.runtimes[1] as Runtime).id);
  }));


  it('should have the suggested runtimes tag when runtime.suggested field is true', () => {
    expect(getRuntimesSection().querySelector('.f8launcher-tags-label.suggested')).toBeDefined();
  });

  it('should not have the suggested runtimes tag when runtime.suggested field is false', fakeAsync(() => {
    component.runtimes[1].suggested = false;
    fixture.detectChanges();
    tick();
    expect(getRuntimeItem(1).querySelector('.f8launcher-tags-label.suggested')).toBeNull();
  }));

  it('should have the prerequisite runtimes tag when runtime.prerequisite field is present', () => {
    expect(getRuntimesSection().querySelector('.f8launcher-tags-label.prerequisite')).toBeDefined();
  });

  it('should not have the prerequisite runtimes tag when runtime.prerequisite field is absent', () => {
    delete component.runtimes[0].prerequisite;
    fixture.detectChanges();
    expect(getRuntimeItem(0).querySelector('.f8launcher-tags-label.prerequisite')).toBeNull();
  });

  it('should have the runtime name as specified', () => {
    const runtimeSection = getRuntimesSection();
    const head = runtimeSection.querySelectorAll('.list-group-item-heading');
    const runtimes = component.runtimes, len = runtimes.length;
    for (let i = 0; i < len; ++ i) {
      expect((<HTMLDivElement> head[i]).innerText.trim()).toBe(runtimes[i].name);
    }
  });

  it('should have the runtime description as specified', () => {
    const runtimeSection = getRuntimesSection();
    const text = runtimeSection.querySelectorAll('.list-group-item-text');
    const runtimes = component.runtimes, len = runtimes.length;
    for (let i = 0; i < len; ++ i) {
      expect((<HTMLDivElement> text[i].children[0]).innerText.trim()).toBe(runtimes[i].description);
    }
  });

  it('should have the runtime description truncated if the length is beyond 65 characters', fakeAsync(() => {
    component.runtimes[0].description = longDescription;
    component.runtimes[1].description = longDescription;
    fixture.detectChanges();
    tick(500);
    const runtimeSection = getRuntimesSection();
    const text = runtimeSection.querySelectorAll('.list-group-item-text');
    for (let i = 0; i < component.runtimes.length; ++ i) {
      expect((<HTMLDivElement> text[i].children[0]).innerText.trim()).toBe(longDescription.substr(0, 65) + '...');
    }
  }));

  it('should handle runtime show more/less correctly', fakeAsync(() => {
    component.runtimes[0].description = longDescription;
    tick(500);
    fixture.detectChanges();
    const item1 = getRuntimeItem(0);
    expect(item1.querySelector('.description.truncated')).toBeTruthy();
    expect(item1.querySelector('.description.full')).toBeFalsy();
    const showMore = <HTMLAnchorElement> item1.querySelector('.description-more a');
    expect(showMore.innerText.trim()).toBe('More');
    showMore.click();
    tick();
    fixture.detectChanges();
    expect(showMore.innerText.trim()).toBe('Less');
    expect(item1.querySelector('.description.truncated')).toBeFalsy();
    expect(item1.querySelector('.description.full')).toBeTruthy();

    const item2 = getRuntimeItem(1);
    expect(item2.querySelector('.description.truncated')).toBeTruthy();
    expect(item2.querySelector('.description.full')).toBeFalsy();
    expect(item2.querySelector('.description-more a')).toBeFalsy();
  }));

  it('should disable the missions, on click of runtime, which aren\'t applicable', fakeAsync(() => {
    fixture.detectChanges();
    selectItem(getRuntimeItem(1));
    expect(component.missions[1].disabled).toBeTruthy();
  }));

  it('should complete step when booster is selected', fakeAsync(() => {
    fixture.detectChanges();
    expect(component.completed).toBeFalsy();
    selectItem(getMissionItem(0));
    expect(component.completed).toBeFalsy();
    selectItem(getRuntimeItem(0));
    expect(component.completed).toBeTruthy();
  }));

  it('should not show versions dropdown when canChangeVersion is false', fakeAsync(() => {
    component.canChangeVersion = false;
    fixture.detectChanges();
    expect(getRuntimeItem(0).querySelector('.dropdown')).toBeFalsy();
    expect(getRuntimeItem(1).querySelector('.dropdown')).toBeFalsy();

    selectItem(getMissionItem(0));
    expect(getRuntimeItem(0).querySelector('.dropdown')).toBeFalsy();
    expect(getRuntimeItem(1).querySelector('.dropdown')).toBeFalsy();

    selectItem(getRuntimeItem(0));
    expect(getRuntimeItem(0).querySelector('.dropdown')).toBeFalsy();
    expect(getRuntimeItem(1).querySelector('.dropdown')).toBeFalsy();
  }));

  it(`should show versions dropdown only when canChangeVersion is true
   and runtime are selected`, fakeAsync(() => {
    component.canChangeVersion = true;
    fixture.detectChanges();
    expect(getRuntimeItem(0).querySelector('.dropdown')).toBeFalsy();
    expect(getRuntimeItem(1).querySelector('.dropdown')).toBeFalsy();

    selectItem(getRuntimeItem(0));
    expect(getRuntimeItem(0).querySelector('.dropdown')).toBeTruthy();
    expect(getRuntimeItem(1).querySelector('.dropdown')).toBeFalsy();

    selectItem(getRuntimeItem(1));
    expect(getRuntimeItem(0).querySelector('.dropdown')).toBeFalsy();
    expect(getRuntimeItem(1).querySelector('.dropdown')).toBeTruthy();
  }));

  it(`should select version when clicking on versions dropdown`, fakeAsync(() => {
    component.canChangeVersion = true;
    fixture.detectChanges();
    expect(component.booster.runtime.version.id).toBeFalsy();
    selectItem(getMissionItem(0));
    expect(component.booster.runtime.version.id).toBeFalsy();
    selectItem(getRuntimeItem(0));
    expect(component.booster.runtime.version.id).toBe('community');
    const item1 = getRuntimeItem(0);
    const versionDropdownButton = <HTMLButtonElement> item1.querySelector('.dropdown button.dropdown-toggle');
    expect(versionDropdownButton).toBeTruthy();
    versionDropdownButton.click();
    tick();
    fixture.detectChanges();
    const redhatVersion = <HTMLLinkElement> item1.querySelectorAll('.dropdown ul.dropdown-menu li a')[1];
    expect(redhatVersion).toBeTruthy();
    redhatVersion.click();
    tick();
    fixture.detectChanges();
    expect(component.booster.runtime.version.id).toBe('redhat');

    // Should auto rest to compatible version
    selectItem(getMissionItem(1));
    expect(component.booster.runtime.version.id).toBe('community');
  }));
});
