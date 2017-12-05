import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';

import { Input as GuiInput, Option } from '../../model/base.model';
import { SingleSelectionDropDownComponent } from './single-selection-dropdown.component';


describe ('SingleSelectionDropDownComponent', () => {
    let component: SingleSelectionDropDownComponent;
    let fixture: ComponentFixture<SingleSelectionDropDownComponent>;

    let guiInput: GuiInput;
    let frmGrp: FormGroup = new FormGroup({});
    let options: Option[] = [];

    let json: Array<any> = [{
        name: 'field1',
        value: 'value1',
        selected: true,
        visible: true
    }];

    let group: any = {};
    json.forEach(value => {
        options.push(value);
        group[value.name] = new FormControl(value.value);
    });

    guiInput = <GuiInput> {
        name: 'field1',
        valueChoices: options
    };

    frmGrp = new FormGroup(group);

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CommonModule,
                FormsModule,
                ReactiveFormsModule
            ],
            declarations: [
                SingleSelectionDropDownComponent
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SingleSelectionDropDownComponent);
        component = fixture.componentInstance;
        component.form = frmGrp;
        component.field = guiInput;
        component.inline = true;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

  it('should record selected choice once selected', async(() => {
    // when
    component.selected({id: 'select_id'});
    fixture.detectChanges();
    // then
    expect(component).toBeTruthy();
    expect(component.field.value).toEqual('select_id');
  }));
});
