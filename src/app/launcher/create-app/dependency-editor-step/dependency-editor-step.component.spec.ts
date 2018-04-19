import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { InViewportModule, WindowRef } from '@thisissoon/angular-inviewport';
import { DependencyEditorCreateappStepComponent } from './dependency-editor-step.component';
import { PopoverModule } from 'ngx-bootstrap';
import { PipeModule } from 'patternfly-ng/pipe';
import { DependencyCheckService } from '../../service/dependency-check.service';
import { LauncherComponent } from '../../launcher.component';
import { LauncherStep } from '../../launcher-step';
import { DependencyEditor } from '../../model/dependency-editor/dependency-editor.model';
import { Summary } from '../../model/summary.model';
import { Selection } from '../../model/selection.model';

describe('ProjectSummaryStepComponent', () => {
    let component: DependencyEditorCreateappStepComponent;
    let fixture: ComponentFixture<DependencyEditorCreateappStepComponent>;

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
            DependencyEditorCreateappStepComponent
        ],
        providers : [
          {
            provide: DependencyCheckService
          },
          {
            provide: LauncherComponent
          },
          {
            provide: WindowRef
          }
        ]
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(DependencyEditorCreateappStepComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });
