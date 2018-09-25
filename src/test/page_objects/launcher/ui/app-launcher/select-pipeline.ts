import * as ui from '../../../../ui' ;


export class SelectPipeline extends ui.BaseElement {
    pipelineContainer = new ui.BaseElement(this.$('.f8launcher-section-release-strategy.f8launcher-container_main--inside'), 'pipeline container');
    pipelineSelect = new ui.Clickable(this.$('.list-group-item.suggested'), 'pipeline select'); // needed action here only redhat suggested pipelines is used
    nextButton = new ui.Button(this.$('#ReleaseStrategy .btn.btn-link'), 'Next Button'); // needed action here

    async createNewApplication() {
      await this.pipelineContainer.ready();
      await this.pipelineSelect.clickWhenReady();
      await this.nextButton.untilClickable();
      await this.nextButton.clickWhenReady();
    }
}
