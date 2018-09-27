import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { Observable, of, Subject} from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

import { ProjectProgressCreateappNextstepComponent } from './project-progress-createapp-nextstep.component';
import { ProjectProgressService } from '../../service/project-progress.service';
import { Progress } from '../../model/progress.model';
import { LauncherComponent } from '../../launcher.component';
import { ProjectSummaryService } from '../../service/project-summary.service';
import { Broadcaster } from 'ngx-base';
import { BroadcasterTestProvider } from '../targetenvironment-createapp-step/target-environment-createapp-step.component.spec';

const progressSubject: Subject<Progress[]> = new Subject();
const mockProjectProgressService = {
  getProgress(): Observable<Progress[]> {
    return progressSubject.asObservable();
  }
};

export interface TypeWizardComponent {
  completed(): any;
}

const mockWizardComponent: TypeWizardComponent = {
  completed() {
    // this.onComplete.emit();
  }
};

const mockProjectSummaryService = {
  setup(): Observable<boolean> {
    return of(true);
  }
};

describe('ProjectProgressComponent', () => {
  let component: ProjectProgressCreateappNextstepComponent;
  let fixture: ComponentFixture<ProjectProgressCreateappNextstepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        RouterTestingModule
      ],
      declarations: [
        ProjectProgressCreateappNextstepComponent
      ],
      providers: [
        { provide: Broadcaster, useValue: BroadcasterTestProvider.broadcaster },
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
