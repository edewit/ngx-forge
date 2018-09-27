import { Che } from './../../model/che.model';
import { WorkspaceLinks } from './../../model/workspace.model';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { Observable, Subject } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

import { ProjectProgressImportappNextstepComponent } from './project-progress-importapp-nextstep.component';
import { ProjectProgressService } from '../../service/project-progress.service';
import { CheService } from '../../service/che.service';
import { WorkSpacesService } from '../../service/workSpaces.service';

import { Progress } from '../../model/progress.model';
import { LauncherComponent } from '../../launcher.component';
import { Broadcaster } from 'ngx-base';
import { BroadcasterTestProvider } from
  '../../create-app/targetenvironment-createapp-step/target-environment-createapp-step.component.spec';

const progressSubject: Subject<Progress[]> = new Subject();
const mockProjectProgressService = {
  getProgress(): Observable<Progress[]> {
    return progressSubject.asObservable();
  }
};

const workSpaceSubject: Subject<WorkspaceLinks> = new Subject();
const mockWorkSpacesService = {
  createWorkSpace(): Observable<WorkspaceLinks> {
    return workSpaceSubject.asObservable();
  }
};

const cheSubject: Subject<Che> = new Subject();
const mockCheService = {
  createWorkSpace(): Observable<Che> {
    return cheSubject.asObservable();
  }
}

export interface TypeWizardComponent {
  completed(): any;
}

const mockWizardComponent: TypeWizardComponent = {
  completed() {
    // this.onComplete.emit();
  }
};

describe('Import ProjectProgressComponent', () => {
  let component: ProjectProgressImportappNextstepComponent;
  let fixture: ComponentFixture<ProjectProgressImportappNextstepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        RouterTestingModule
      ],
      declarations: [
        ProjectProgressImportappNextstepComponent
      ],
      providers: [
        { provide: Broadcaster, useValue: BroadcasterTestProvider.broadcaster },
        {
          provide: LauncherComponent, useValue: mockWizardComponent
        },
        {
          provide: ProjectProgressService, useValue: mockProjectProgressService
        },
        {
          provide: CheService, useValue: mockCheService
        },
        {
          provide: WorkSpacesService, useValue: mockWorkSpacesService
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectProgressImportappNextstepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should test ngOnChanges', () => {
    const input: any = {
      statusLink: {
        currentValue: 'currentValue'
      }
    };
    spyOn(component, 'ngOnChanges');
    component.ngOnChanges(input);
    expect(component.ngOnChanges).toHaveBeenCalledWith(input);
  });
});
