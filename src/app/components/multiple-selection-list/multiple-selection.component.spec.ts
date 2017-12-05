import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';

import { CommonModule } from '@angular/common';
import { FormsModule, FormGroup, FormControl } from '@angular/forms';

import { Input as GuiInput, Option } from '../../model/base.model';
import { MultipleSelectionListComponent } from './multiple-selection-list.component';
import { SelectedItemsPipe } from './selected-items.pipe';
import { VisibleItemsPipe } from './visible-items.pipe';


describe ('MultipleSelectionListComponent', () => {
    let component: MultipleSelectionListComponent;
    let fixture: ComponentFixture<MultipleSelectionListComponent>;

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
                FormsModule
            ],
            declarations: [
                SelectedItemsPipe,
                VisibleItemsPipe,
                MultipleSelectionListComponent
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MultipleSelectionListComponent);
        component = fixture.componentInstance;
        component.form = frmGrp;
        component.field = guiInput;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

  it('should detect when select component has value', () => {
    // given
    guiInput.value = 'pickme';
    // when
    const hasValue = component.hasValue(guiInput);
    // then
    expect(hasValue).toBeTruthy();
  });

  it('should detect when select component is null', () => {
    // given
    guiInput.value = null;
    const hasNoValue = component.hasValue(guiInput);
    // when
    const hasValue = component.hasValue(guiInput);
    // then
    expect(hasNoValue).toBeFalsy();
  });

  it('should detect when select component is empty', () => {
    // given
    guiInput.value = '';
    const hasNoValue = component.hasValue(guiInput);
    // when
    const hasValue = component.hasValue(guiInput);
    // then
    expect(hasNoValue).toBeFalsy();
  });

  it('should mark dirty when a new selection is done', () => {
    // given
    const option: Option = {
      id: 'opt1',
      key: 'opt1',
      description: 'opt1 description',
      name: 'opt1 name',
      selected: false,
      visible: true,
      descriptionMarkdown: '',
      display: '',
      stages: ''
    };

    // when
    const hasValue = component.selectChoice(option, true);
    // then
    expect(option.selected).toBe(true);
    expect(component.form.controls['field1'].dirty).toBeTruthy();
  });
});
