import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Input as GuiInput, Option } from '../../model/base.model';
import { PipelineViewComponent } from './pipeline-view.component';


describe ('PipelineViewComponent', () => {
    let component: PipelineViewComponent;
    let fixture: ComponentFixture<PipelineViewComponent>;

    let guiInput: GuiInput;
    let options: Option[] = [];

    let json: Array<any> = [{
        name: 'field1',
        value: 'value1',
        description: 'Test Description',
        descriptionMarkdown: '### title',
        display: {},
        stages: [{
            color: 'RED',
            name: 'Stage'
        }]
    }];
    json.forEach(value => {
        options.push(value);
    });

    guiInput = <GuiInput> {
        name: 'field1',
        valueChoices: options
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CommonModule,
                FormsModule
            ],
            declarations: [
                PipelineViewComponent
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PipelineViewComponent);
        component = fixture.componentInstance;
        component.field = guiInput;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

  it('should use warning color and icon for approve state', () => {
    // given
    const buildState = {stages: ['approve', 'anything_else']};

    // when
    const stages = component.buildStages(buildState);

    // then
    expect(component).toBeTruthy();
    expect(stages[0][<any>'name']).toEqual('approve');
    expect(stages[0][<any>'icon']).toEqual('fa-pause-circle');
    expect(stages[0][<any>'color']).toEqual('warning');
    expect(stages[1][<any>'name']).toEqual('anything_else');
    expect(stages[1][<any>'icon']).toEqual('fa-check-circle');
    expect(stages[1][<any>'color']).toEqual('success');
  });
});
