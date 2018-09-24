import * as ui from '../../../../ui' ;
import { by } from 'protractor';


export class GitProvider extends ui.BaseElement {
  gitProvider = new ui.BaseElement(this.$('#GitProvider'), 'Git Provider');
  gitLocation = new ui.BaseElement(this.$('#ghOrg'), 'Github organisation');
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
    await this.gitLocation.clickWhenReady();
    await this.selectAccount(' Test-getting-started ');
    await this.gitrepoName.clear();
    await this.gitrepoName.enterText(repoName);
    await this.nextButton.untilClickable();
    await this.nextButton.clickWhenReady();
  }
}
