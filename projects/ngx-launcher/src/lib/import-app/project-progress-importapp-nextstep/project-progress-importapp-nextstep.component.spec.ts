import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { Observable, Subject } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

import { ProjectProgressImportappNextstepComponent } from './project-progress-importapp-nextstep.component';
import { ProjectProgressService } from '../../service/project-progress.service';

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

  it('View pipeline button should not be visible if nextbuttons value is false', () => {
    fixture.detectChanges();
    const viewPipelineButton: HTMLElement = fixture.nativeElement.querySelector('.f8launcher-viewpipeline');
    expect(viewPipelineButton).toBeFalsy();
  });
});
