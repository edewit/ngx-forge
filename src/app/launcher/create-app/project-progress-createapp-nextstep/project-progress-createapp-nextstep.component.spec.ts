import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';
import { Observable, Subject } from 'rxjs';

import { ProjectProgressCreateappNextstepComponent } from './project-progress-createapp-nextstep.component';
import { ProjectProgressService } from '../../service/project-progress.service';
import { Progress } from '../../model/progress.model';
import { LauncherComponent } from '../../launcher.component';
import { LauncherStep } from '../../launcher-step';

let progressSubject: Subject<Progress[]> = new Subject();
let mockProjectProgressService = {
  getProgress(): Observable<Progress[]>{
    return progressSubject.asObservable();
  },
  getItems(): Progress[] {
    let progress = [{
      'completed': false,
      'description': 'Creating New GitHub Repository',
      'hypertext': 'View New Repository',
      'inProgress': false,
      'url': 'https://github.com/fabric8-launcher/ngx-launcher'
    }, {
      'completed': false,
      'description': 'Pushing Customized Booster Code into the Repository',
      'inProgress': false
    }, {
      'completed': false,
      'description': 'Creating Your Project on the OpenShift Cloud',
      'inProgress': false,
      'hypertext': 'View New Application',
      'url': 'https://github.com/fabric8-launcher/ngx-launcher'
    }, {
      'completed': false,
      'description': 'Setting up Build Pipeline',
      'inProgress': false
    }, {
      'completed': false,
      'description': 'Configure Trigger Builds on Git Pushes',
      'inProgress': false
    }] as Progress[];
    return progress;
  }
}
export interface TypeWizardComponent {
  selectedSection: string;
  steps: LauncherStep[];
  summary: any;
  summaryCompleted: boolean;
  addStep(step: LauncherStep): void;
}

let mockWizardComponent: TypeWizardComponent = {
  selectedSection: '',
  steps: [],
  summary: {
    dependencyCheck: {},
    gitHubDetails: {}
  },
  summaryCompleted: false,
  addStep(step: LauncherStep){
    for (let i = 0; i < this.steps.length; i++) {
      if (step.id === this.steps[i].id) {
        return;
      }
    }
    this.steps.push(step);
  }
}

describe('ProjectProgressComponent', () => {
  let component: ProjectProgressCreateappNextstepComponent;
  let fixture: ComponentFixture<ProjectProgressCreateappNextstepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule
      ],
      declarations: [
        ProjectProgressCreateappNextstepComponent
      ],
      providers:[
        {
          provide: LauncherComponent, useValue: mockWizardComponent
        },
        {
          provide: ProjectProgressService, useValue: mockProjectProgressService
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectProgressCreateappNextstepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
