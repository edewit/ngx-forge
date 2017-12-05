import {async, ComponentFixture, fakeAsync, TestBed} from '@angular/core/testing';

import {By} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

import {GenericPage} from './mock/test.page';
import {InputComponent} from './input.component';
import {MultiselectDropdownModule} from 'angular-2-dropdown-multiselect';
import {History} from '../../service/history.component';

let comp: GenericPage;
let fixture: ComponentFixture<GenericPage>;

const baseJson: any = {
  'metadata': {
    'deprecated': false,
    'category': 'Project/Generation',
    'name': 'Project: New',
    'description': 'Createanewproject'
  },
  'state': {
    'valid': false,
    'canExecute': true,
    'wizard': true,
    'canMoveToNextStep': false,
    'canMoveToPreviousStep': false,
    'steps': ['']
  }
};

const typeText = {
  'inputs': [
    {
      'name': 'text',
      'shortName': ' ',
      'valueType': 'java.lang.String',
      'inputType': 'org.jboss.forge.inputType.DEFAULT',
      'enabled': true,
      'required': true,
      'deprecated': false,
      'label': 'name',
      'class': 'UIInput'
    }]
};

const typeNumber = {
  'inputs': [
    {
      'name': 'number',
      'shortName': ' ',
      'valueType': 'java.lang.Integer',
      'inputType': 'org.jboss.forge.inputType.DEFAULT',
      'enabled': true,
      'required': true,
      'deprecated': false,
      'label': 'name',
      'class': 'UIInput'
    }]
};

const typeSelect = {
  'inputs': [
    {
      'name': 'type',
      'shortName': ' ',
      'valueType': 'io.openshiftio.generator.catalog.Quickstart',
      'inputType': 'org.jboss.forge.inputType.RADIO',
      'enabled': true,
      'required': true,
      'deprecated': false,
      'label': 'Project type',
      'description': 'Quickstart to expose a REST Greeting endpoint using SpringBoot & Secured by Red Hat SSO',
      'note': 'Quickstart to expose a REST Greeting endpoint using SpringBoot & Secured by Red Hat SSO',
      'valueChoices': [
        {
          'id': 'Secured Spring Boot Tomcat - Rest & Red Hat SSO',
          'description': 'Quickstart to expose a REST Greeting endpoint using SpringBoot & Secured by Red Hat SSO',
          'gitRef': 'master',
          'githubRepo': 'lauchpad-quickstarts/secured_rest-springboot',
          'metadata': {
            'name': 'Secured Spring Boot Tomcat - Rest & Red Hat SSO',
            'description': 'Quickstart to expose a REST Greeting endpoint using SpringBoot & Secured by Red Hat SSO'
          },
          'name': 'Secured Spring Boot Tomcat - Rest & Red Hat SSO'
        }
      ],
      'class': 'UISelectOne',
      'value': 'Secured Spring Boot Tomcat - Rest & Red Hat SSO'
    }
  ]
};

describe('Dynamic form should be created for json that comes from the server', () => {
  let historyStub = new History();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, MultiselectDropdownModule],
      declarations: [GenericPage, InputComponent],
      providers: [
        {provide: History, useValue: historyStub},
        {
          provide: ActivatedRoute, useValue: {}
        },
        {
          provide: Router, useValue: {}
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GenericPage);
    comp = fixture.componentInstance;
  }));

  it('should create a input type text for specified json', () => {
    setupUI(typeText);

    expect(comp.gui == null).toBe(false);
    expect(comp.gui.inputs == null).toBe(false);
    expect(comp.gui.inputs.length).toBe(1);

    const input = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    expect(input.getAttribute('type')).toBe('text');
  });

  it('should create a type number for specified json', fakeAsync(() => {
    setupUI(typeNumber);

    const input = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    expect(input.getAttribute('type')).toBe('number');
  }));

  it('should create a type radio for specified json', fakeAsync(() => {
    setupUI(typeSelect);

    const input = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    expect(input.getAttribute('type')).toBe('radio');
  }));

  it('should convert options with struct of id and name', fakeAsync(() => {
    // given
    setupUI(typeSelect);
    // when
    const convertedOptions = comp.convertToOptions(['value1', 'value2']);
    // then
    expect(convertedOptions[0][<any>'id']).toBe('value1');
    expect(convertedOptions[0][<any>'name']).toBe('value1');
    expect(convertedOptions[1][<any>'id']).toBe('value2');
    expect(convertedOptions[1][<any>'name']).toBe('value2');
  }));

  it('should return a message if existing', fakeAsync(() => {
    // given
    setupUI(typeSelect);
    const error1 = {
      description: 'error1 description',
      input: 'error1',
      severity: 'High',
      showError: true
    };
    comp.messages = [error1];

    // when
    const messageError1 = comp.messageForInput('error1');
    const messageError2 = comp.messageForInput('error2');
    // then
    expect(messageError1).toBe(error1);
    expect(messageError2).toBe(undefined);
  }));

  function setupUI(obj: any) {
    comp.gui = Object.assign(baseJson, obj);
    fixture.detectChanges();
  }
});
