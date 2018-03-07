import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputComponent } from './src/app/components/input/input.component';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { ProjectSelect } from './src/app/components/project-select/project-select.component';
import { Config } from './src/app/service/config.component';
import { ForgeService } from './src/app/service/forge.service';
import { History } from './src/app/service/history.component';
import { SanitizeUrlPipe } from './src/app/components/sanitize/sanitize.url.pipe';

const classes = [
  InputComponent,
  ProjectSelect,
  SanitizeUrlPipe
];

@NgModule({
  imports: [CommonModule, FormsModule, MultiselectDropdownModule],
  exports: classes,
  declarations: classes,
  providers: [
    ForgeService,
    History,
    Config
  ],
  schemas: []
})
export class NgxForgeModule {
}

