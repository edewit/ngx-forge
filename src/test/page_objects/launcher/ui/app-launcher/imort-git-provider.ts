import * as ui from '../../../../ui' ;
import { by, browser } from 'protractor';


export class ImportGitProvider extends ui.BaseElement {
  launcherContainer = new ui.BaseElement(this.$('.f8launcher'), 'launcher container');
  gitProvider = new ui.BaseElement(this.$('#GitProvider'), 'Git Provider');
  gitrepoName = new ui.TextInput(this.$('#ghRepo'), 'git repository name');
  nextButton = new ui.Button(this.$('#GitProvider .btn.btn-link'), 'Next Button');

  async selectAccount(gitUserName: string) {
    let selectGitAccount = new ui.BaseElement(
      this.element(by.xpath(
        "//select[@id='ghOrg']/option[contains(text(), '" + gitUserName + "')]")), 'select github account'
    );
    await selectGitAccount.untilTextIsPresent(gitUserName);
    await selectGitAccount.clickWhenReady();
  }

  async createNewApplication(repoName: string) {
    await this.gitProvider.ready();
    await this.selectAccount(' Test-getting-started ');
    await this.gitrepoName.untilClickable();
    await this.gitrepoName.enterText(repoName);
    await this.nextButton.untilClickable();
    await this.nextButton.clickWhenReady();
  }
}
