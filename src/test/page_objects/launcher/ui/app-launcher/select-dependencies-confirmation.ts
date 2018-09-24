import * as ui from '../../../../ui' ;


export class SelectDependencies extends ui.BaseElement {
  nextButton = new ui.Button(this.$('#SelectDependencies .btn.btn-link'), 'Next Button');

  async createNewApplication() {
    await this.nextButton.untilClickable();
    await this.nextButton.clickWhenReady();
  }
}
