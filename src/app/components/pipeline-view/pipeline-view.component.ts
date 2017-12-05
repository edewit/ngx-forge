import { Component, Input, OnInit } from '@angular/core';
import { Input as GuiInput, Option } from '../../model/base.model';
import * as marked from 'marked';

@Component({
  selector: 'pipeline-view',
  templateUrl: './pipeline-view.component.html',
  styleUrls: [ './pipeline-view.component.less' ]
})
export class PipelineViewComponent implements OnInit {


  @Input() field: GuiInput;
  constructor() {}

  ngOnInit() {
    this.addDisplay(this.field);
  }

  buildStages(value: any): Array<string> {
    let stages: Array<string> = [];
    let n: number = 0;
    for (let s of value.stages) {
      let stage: any = {
        name: s,
        index: n,
        icon: this.determineIcon(s),
        color: this.determineColor(s)
      };
      n++;
      stages.push(stage);

    }
    return stages;
  }

  private addDisplay(field: GuiInput) {
    let index: number = 0;
    for (let choice of field.valueChoices) {
      this.formatHtml(choice, index);
      index++;
    }
  }

  private determineColor(value: string): string {
    if (value) {
      const found = value.toLowerCase().includes('approve');
      if (found) {
        return 'warning';
      }
    }
    return 'success';
  }

  private determineIcon(value: any|string): string {
    if (value) {
      const found = value.toLowerCase().includes('approve');
      if (found) {
        return 'fa-pause-circle';
      }
    }
    return 'fa-check-circle';
  }

  private formatHtml(choice: Option, index: number) {
    choice.display = {
      isDefault: true,
      hasIcon: false,
      icon: 'fa fa-check',
      view: 'image',
      collapsed: true,
      collapsible: true,
      hasView: true,
      verticalLayout: true
    };
    choice.name = choice.id;
    choice.description = choice.descriptionMarkdown;
    choice.description = choice.description.replace(/\n\n/g, '\n');
    let renderer = new marked.Renderer();
    choice.description = marked(choice.description, { renderer: renderer });
    if (choice.stages && choice.stages[0] && !choice.stages[0].name) { // deal with back button format ouput only once.
      choice.stages = this.buildStages(choice);
    }
  }
}
