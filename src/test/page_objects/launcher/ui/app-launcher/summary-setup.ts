import * as ui from '../../../../ui' ;
import { by } from 'protractor';


export class SetupApp extends ui.BaseElement {
  summaryApplication = new ui.BaseElement(this.$('#NewProjectBooster'), 'Summary of New Application');
  viewApplication = new ui.Button(this.$('.f8launcher-continue>button'), 'view new application');

  newProjectBoosterOkIcon(name: string): ui.BaseElement {
    return new ui.BaseElement(
      this.element(by.xpath(
        '//*[@class =\'list-pf-item\']' +
        '//*[contains(text(),\'' + name + '\')]' +
        '//ancestor::div[contains(@class,\'pfng-list-content\')]' +
        '//*[@class =\'list-pf-left\']/span')),
        'OK Icon (' + name + ')'
    );
  }

  async clickViewNewApplicationButton() {
    await this.summaryApplication.ready();
    await this.viewApplication.clickWhenReady();
  }
}
