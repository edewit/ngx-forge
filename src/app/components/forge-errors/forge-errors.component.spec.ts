import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';

import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { Gui, Message } from '../../model/base.model';
import { ForgeErrorsComponent } from './forge-errors.component';


describe ('ForgeErrorsComponent', () => {
    let component: ForgeErrorsComponent;
    let fixture: ComponentFixture<ForgeErrorsComponent>;

    let messages: Message[] = [];

    messages.push(new Message('Test Description 1'));

    let gui: Gui = new Gui();
    gui.messages = messages;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CommonModule,
                FormsModule
            ],
            declarations: [
                ForgeErrorsComponent
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ForgeErrorsComponent);
        component = fixture.componentInstance;
        component.field = gui;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have the declared messages', () => {
        expect(component.field == null).toBe(false);
        expect(component.field.messages == null).toBe(false);
        expect(component.field.messages.length).toBe(messages.length);
    });

    it(`should have ${messages.length} list item created`, () => {
        const listItems: Array<HTMLUListElement> = fixture.debugElement.query(By.css('li')).nativeElement;
        expect(listItems.length === messages.length);
    });

    it('should have the inner Text as the one from JSON', () => {
        const listItems: Array<HTMLUListElement> = fixture.debugElement.query(By.css('li')).nativeElement;
        const len = listItems.length;
        for (let i = 0; i < len; ++ i) {
            expect(listItems[i].innerText === messages[i].description);
        }
    });
});
