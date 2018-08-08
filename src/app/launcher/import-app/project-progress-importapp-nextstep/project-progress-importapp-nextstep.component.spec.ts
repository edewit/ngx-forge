import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { Observable, Subject } from 'rxjs';

import { ProjectProgressImportappNextstepComponent } from './project-progress-importapp-nextstep.component';
import { ProjectProgressService } from '../../service/project-progress.service';
import { Progress } from '../../model/progress.model';
import { LauncherComponent } from '../../launcher.component';

let progressSubject: Subject<Progress[]> = new Subject();
let mockProjectProgressService = {
  getProgress(): Observable<Progress[]> {
    return progressSubject.asObservable();
  },
  getItems(): Progress[] {
    let progress = [{
      'completed': false,
      'description': 'Creating Your Project on the OpenShift Cloud',
      'hypertext': 'View New Application',
      'url': 'https://github.com/fabric8-launcher/ngx-launcher'
    }, {
      'completed': false,
      'description': 'Setting up Build Pipeline'
    }, {
      'completed': false,
      'description': 'Configure Trigger Builds on Git Pushes'
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

describe('Import ProjectProgressComponent', () => {
  let component: ProjectProgressImportappNextstepComponent;
  let fixture: ComponentFixture<ProjectProgressImportappNextstepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule
      ],
      declarations: [
        ProjectProgressImportappNextstepComponent
      ],
      providers: [
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
