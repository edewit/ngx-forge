import * as ui from '../../../../ui' ;
import { browser } from 'protractor';


export class ImportSelectPipeline extends ui.BaseElement {
  pipelineContainer = new ui.BaseElement(this.$('#ReleaseStrategy'), 'pipeline container');
  pipelineSelect = new ui.Clickable(this.$('.list-group-item.suggested'), 'pipeline select'); // needed action here
  nextButton = new ui.Button(this.$('#ReleaseStrategy .btn.btn-link'), 'Next Button'); // needed action here

  async createNewApplication() {
    await this.pipelineContainer.ready();
    await this.pipelineSelect.clickWhenReady();
    await this.nextButton.untilClickable();
    await this.nextButton.clickWhenReady();
  }
}
