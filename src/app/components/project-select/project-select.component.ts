import {Component, forwardRef, Input, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DefaultValueAccessor, FormsModule, NG_VALUE_ACCESSOR} from '@angular/forms';
import {Input as Field, Option} from '../../model/base.model';

const PROJECTSELECT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ProjectSelect),
  multi: true
};

@Component({
  selector: 'ob-project-select',
  providers: [PROJECTSELECT_VALUE_ACCESSOR],
  templateUrl: './project-select.component.html',
  styleUrls: ['./project-select.component.less']
})
export class ProjectSelect extends DefaultValueAccessor {
  @Input() input: Field;
  @Input() config: ProjectSelectConfig;
  model: string;

  writeValue(value: any): void {
    if (value !== undefined) {
      this.model = value;
    }
  }

  className(option: Option): string {
    for (let key of this.config.classes) {
      if (option.id.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
        return key;
      }
    }
    return '';
  }

  techPreview(option: Option): boolean {
    const className = this.className(option);
    return this.config.techPreview.indexOf(className) !== -1;
  }

  isSelected(option: Option): boolean {
    return this.model === option.id;
  }

  setSelected(option: Option) {
    this.model = option.id;
    this.onChange(this.model);
  }

}

export class ProjectSelectConfig {
  classes: string[] = [];
  techPreview: string[] = [];
  renderType: string = 'title';
}

@NgModule({
  imports: [CommonModule, FormsModule],
  exports: [ProjectSelect, ProjectSelectConfig],
  declarations: [ProjectSelect, ProjectSelectConfig]
})
export class ProjectSelectModule {
}
