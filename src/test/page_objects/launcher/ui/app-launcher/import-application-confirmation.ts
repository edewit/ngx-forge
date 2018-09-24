import * as ui from '../../../../ui' ;
import { browser } from 'protractor';


export class ImportApplication extends ui.BaseElement {
  nextButton = new ui.Button(this.$('.btn.btn-primary.btn-xlarge'), 'Next Button');

  async createNewApplication() {
    await this.nextButton.untilClickable();
    await this.nextButton.clickWhenReady();
  }
}
