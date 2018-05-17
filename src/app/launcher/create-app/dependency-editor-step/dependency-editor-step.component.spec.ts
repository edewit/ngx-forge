import {
   async,
   ComponentFixture,
   TestBed }
 from '@angular/core/testing';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { KeyValueDiffers } from '@angular/core';
import { InViewportModule, WindowRef } from '@thisissoon/angular-inviewport';
import { DependencyEditorCreateappStepComponent } from './dependency-editor-step.component';
import { DependencyEditorService } from '../../service/dependency-editor.service';
import { LauncherComponent } from '../../launcher.component';
import { LauncherStep } from '../../launcher-step';
import { RouterTestingModule } from '@angular/router/testing';
import { DependencyEditor } from '../../model/dependency-editor/dependency-editor.model';
import { Summary } from '../../model/summary.model';
import { Selection } from '../../model/selection.model';
import { DependencyEditorModule,  URLProvider, DependencyEditorTokenProvider }
 from 'fabric8-analytics-dependency-editor';

describe('DependencyEditorCreateappStepComponent', () => {
    let component: DependencyEditorCreateappStepComponent;
    let fixture: ComponentFixture<DependencyEditorCreateappStepComponent>;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [
          CommonModule,
          FormsModule,
          InViewportModule,
          DependencyEditorModule,
          RouterTestingModule
        ],
        declarations: [
            DependencyEditorCreateappStepComponent
        ],
        providers : [
            DependencyEditorService,
            LauncherComponent,
            URLProvider,
            DependencyEditorTokenProvider,
            KeyValueDiffers,
            WindowRef
        ]
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(DependencyEditorCreateappStepComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    fit('should create', () => {
      expect(component).toBeTruthy();
    });
  });
