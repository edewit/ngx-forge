import * as ui from '../../../../ui' ;
import { by, By } from 'protractor';


export class SelectMissionRuntime extends ui.BaseElement {
  launcherContainer = new ui.BaseElement(this.$('.f8launcher'), 'launcher container');
  selectCheckBox = new ui.Clickable(this.$('.list-view-pf-checkbox'), 'select mission or runtime checkbox');
  nextButton = new ui.Button(this.$('.btn.btn-link'), 'Next Button');
  clearSelection = new ui.Button(this.$('#MissionRuntime .btn.btn-default.pull-right'), 'clear selection');
  closeApplication = new ui.Clickable(this.$('.sticky.close.animate-continue'), 'close areate application');

  async selectRuntime(name: string) {
    let selection = new ui.Button(
      this.element(by.xpath(
        '//div[@class=\'list-group-item-heading\'][contains(text(),\'' + name + '\')]')), 'Select Runtime'
    );
    await selection.clickWhenReady();
  }

  async selectMission(name: string) {
    let selection = new ui.Button(
      this.element(By.xpath(
        '//div[@class=\'list-group-item-heading\'][contains(text(),\'' + name + '\')]')), 'Select Mission'
    );
    await selection.clickWhenReady();
  }

  async createNewApplication(mission: string, runtime: string) {
    await this.selectMission(mission);
    await this.selectRuntime(runtime);
    await this.nextButton.untilClickable();
    await this.nextButton.clickWhenReady();
  }

  async closeNewApplication() {
    await this.closeApplication.untilClickable();
    await this.closeApplication.clickWhenReady();
  }
}
