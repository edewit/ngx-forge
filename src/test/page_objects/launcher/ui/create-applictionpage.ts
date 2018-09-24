import * as ui from '../../../ui' ;
import { element, by } from 'protractor';


export class CreateApplication extends ui.BaseElement {
  createApplication = new ui.BaseElement(this.$('.code-imports--step_title'), 'create application string');
  importDialog = new ui.BaseElement(this.$('.imports-dialog'), 'create application dialog');
  newApplicationName = new ui.TextInput(this.$('#projectName'), 'new application name');
  createNewApplication = new ui.Clickable(this.element(by.cssContainingText('.row.codebase-card-container', ' Create a new codebase ')), 'create new application');
  importExistingApplication = new ui.Checkbox(this.element(by.cssContainingText('.row.codebase-card-container', ' Import an existing codebase ')), 'import existing application'); // need action here
  continueButton = new ui.Button(this.$('#cancelImportsButton'), 'create application button');
  cancelSign = new ui.Clickable(this.$('.sticky.close.animate-continue'), 'cancel new application');

  async createAnApplication(applicationName: string) {
    await this.newApplication(applicationName);
    await this.createNewApplication.clickWhenReady();
    await this.continueButton.untilClickable(); // needed action here
    await this.continueButton.clickWhenReady();
  }

  async importAnApplication(applicationName: string) {
    await this.newApplication(applicationName);
    await this.importExistingApplication.clickWhenReady();
    await this.continueButton.untilClickable();
    await this.continueButton.clickWhenReady();
  }

  async cancelNewApplication(applicationName: string) {
    await this.newApplication(applicationName);
    await this.cancelSign.clickWhenReady();
  }

  private async newApplication(applicationName: string) {
    await this.createApplication.untilTextIsPresent('Create an Application');
    await this.importDialog.ready();
    await this.newApplicationName.enterText(applicationName);
  }
}
