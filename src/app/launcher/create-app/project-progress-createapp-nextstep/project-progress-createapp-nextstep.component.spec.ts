import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';
import { Observable, Subject } from 'rxjs';

import { ProjectProgressCreateappNextstepComponent } from './project-progress-createapp-nextstep.component';
import { ProjectProgressService } from '../../service/project-progress.service';
import { Progress } from '../../model/progress.model';
import { LauncherComponent } from '../../launcher.component';
import { LauncherStep } from '../../launcher-step';
import { Summary } from '../../model/summary.model';
import { ProjectSummaryService } from '../../service/project-summary.service';

let progressSubject: Subject<Progress[]> = new Subject();
let mockProjectProgressService = {
  getProgress(): Observable<Progress[]> {
    return progressSubject.asObservable();
  },
  getItems(): Progress[] {
    let progress = [{
      'completed': false,
      'description': 'Creating New GitHub Repository',
      'hypertext': 'View New Repository',
      'url': 'https://github.com/fabric8-launcher/ngx-launcher'
    }, {
      'completed': false,
      'description': 'Pushing Customized Booster Code into the Repository',
    }, {
      'completed': false,
      'description': 'Creating Your Project on the OpenShift Cloud',
      'hypertext': 'View New Application',
      'url': 'https://github.com/fabric8-launcher/ngx-launcher'
    }, {
      'completed': false,
      'description': 'Setting up Build Pipeline',
    }, {
      'completed': false,
      'description': 'Configure Trigger Builds on Git Pushes',
    }] as Progress[];
    return progress;
  }
};

export interface TypeWizardComponent {
  completed(): any;
}

let mockWizardComponent: TypeWizardComponent = {
  completed() {
    // this.onComplete.emit();
  }
};

let mockProjectSummaryService = {
  setup(summary: Summary): Observable<boolean> {
    return Observable.of(true);
  }
};

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
      providers: [
        {
          provide: LauncherComponent, useValue: mockWizardComponent
        },
        {
          provide: ProjectSummaryService, useValue: mockProjectSummaryService
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

  it('should test ngOnChanges', () => {
    let input: any = {
      statusLink: {
        currentValue: 'currentValue'
      }
    };
    spyOn(component, 'ngOnChanges');
    component.ngOnChanges(input);
    expect(component.ngOnChanges).toHaveBeenCalledWith(input);
  });
});
