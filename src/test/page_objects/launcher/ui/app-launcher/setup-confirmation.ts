import * as ui from '../../../../ui' ;


export class Setup extends ui.BaseElement {
  setupButton = new ui.Button(this.$('#ProjectSummary .btn.btn-primary.btn-xlarge'), 'Setup Button');

  async setupNewApplication() {
    await this.setupButton.untilTextIsPresent('Set Up Application');
    await this.setupButton.clickWhenReady();
  }
}
