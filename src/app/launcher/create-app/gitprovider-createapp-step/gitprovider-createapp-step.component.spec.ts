import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonModule } from '@angular/common';
import { GitproviderCreateappStepComponent } from './gitprovider-createapp-step.component';

describe('GitProviderStepComponent', () => {
  let component: GitproviderCreateappStepComponent;
  let fixture: ComponentFixture<GitproviderCreateappStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule
      ],
      declarations: [
        GitproviderCreateappStepComponent
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GitproviderCreateappStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
