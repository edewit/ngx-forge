import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';

import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { ForgeExceptionComponent } from './forge-exception.component';


describe ('ForgeExceptionComponent', () => {
    let component: ForgeExceptionComponent;
    let fixture: ComponentFixture<ForgeExceptionComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CommonModule,
                FormsModule
            ],
            declarations: [
                ForgeExceptionComponent
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ForgeExceptionComponent);
        component = fixture.componentInstance;
        component.error = {};
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
