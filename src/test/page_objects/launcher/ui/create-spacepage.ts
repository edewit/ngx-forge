import * as ui from '../../../ui' ;


export class CreateSpace extends ui.BaseElement {
  launcherDialog = new ui.BaseElement(this.$('.launcher-dialog'), 'launcher dialog');
  spaceName = new ui.TextInput(this.$('#add-space-overlay-name'), 'space name');
  okButton = new ui.Button(this.$('#createSpaceButton'), 'Create Space Button');
  cancelButton = new ui.Button(this.$('#cancelSpaceButton'), 'Cancel Space Button');

  async createNewSpace(spaceName: string) {
    await this.launcherDialog.ready();
    await this.spaceName.enterText(spaceName);
    await this.okButton.untilClickable();
    await this.okButton.clickWhenReady();
  }
}
