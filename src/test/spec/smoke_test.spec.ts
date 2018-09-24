import * as support from '../support';
import { browser, element } from 'protractor';
import { LauncherPage } from '../page_objects/launcher/LauncherPage';
import { async } from 'q';
import { SpaceName } from '../support';

/**
 * Simple dec for log in and log out.
 */
describe('smoke_test', () => {
  let launcher: LauncherPage;
  let spaceName: string;
  let appName: string;


  beforeAll(async () => {
    await support.desktopTestSetup();
    launcher = new LauncherPage(browser.baseUrl);
    let space = new support.SpaceName;
    spaceName = space.newSpaceName();
    appName = space.newApplicationName();
    await launcher.openInBrowser();
    await launcher.waitUntilUrlContains('/_home');
  });

  beforeEach(async() => {
    await launcher.ready();
    let space = new support.SpaceName;
    spaceName = space.newSpaceName();
    appName = space.newApplicationName();
  });

  it('should create new application', async() => {
    await launcher.appHeader.selectCreateSpace(' Create space ');
    await launcher.createSpacePage.createNewSpace(spaceName);
    await launcher.waitUntilUrlContains('/' + spaceName);
    expect(await browser.getCurrentUrl()).toContain(spaceName);
    await launcher.createApplicationPage.cancelNewApplication('testdemo');
    await launcher.appHeader.untilTextIsPresent('Analyze');
    expect (await browser.getTitle()).toContain('Analyze');
  });

  it('should create new application', async() => {
    await launcher.appHeader.selectCreateSpace(' Create space ');
    await launcher.createSpacePage.createNewSpace(spaceName);
    await launcher.waitUntilUrlContains('/' + spaceName);
    expect(browser.getCurrentUrl()).toContain(spaceName);
    await launcher.createApplicationPage.createAnApplication(appName);
    await launcher.waitUntilUrlContains('/createapp/' + appName);

    await launcher.selectMissionRuntime.createNewApplication('Health Check', 'Eclipse Vert.x');
    await launcher.selectDependencies.createNewApplication();
    await launcher.selectPipeline.createNewApplication();
    await launcher.gitProvider.ready();
    await launcher.gitProvider.createNewApplication(appName);
    await launcher.setup.setupNewApplication();
    await launcher.setupApp.viewApplication.untilTextIsPresent('View New Application');
    await launcher.setupApp.newProjectBoosterOkIcon('Creating your new GitHub repository').untilDisplayed();
    await launcher.setupApp.newProjectBoosterOkIcon('Pushing your customized Booster code into the repo')
      .untilDisplayed();
    await launcher.setupApp.newProjectBoosterOkIcon('Creating your project on OpenShift').untilDisplayed();
    await launcher.setupApp.newProjectBoosterOkIcon('Setting up your build pipeline').untilDisplayed();
    await launcher.setupApp.newProjectBoosterOkIcon('Configuring to trigger builds on Git pushes')
      .untilDisplayed();
    await launcher.setupApp.clickViewNewApplicationButton();
    await launcher.appHeader.untilTextIsPresent('Analyze');
    expect (await browser.getTitle()).toContain('Analyze');
  });

  it('should import application', async() => {
    await launcher.appHeader.selectCreateSpace(' Create space ');
    await launcher.createSpacePage.createNewSpace(spaceName);
    await launcher.waitUntilUrlContains('/' + spaceName);
    expect(browser.getCurrentUrl()).toContain(spaceName);
    await launcher.createApplicationPage.importAnApplication(appName);
    await launcher.waitUntilUrlContains('/importapp/' + appName);
    await launcher.importGitProvider.createNewApplication('testde');
    await launcher.importSelectPipeline.createNewApplication();
    await launcher.importApplication.createNewApplication();
    await launcher.importSetup.viewApplication.untilTextIsPresent('View New Application');
    await launcher.importSetup.newProjectBoosterOkIcon('Creating your project on OpenShift').untilDisplayed();
    await launcher.importSetup.newProjectBoosterOkIcon('Pushing your customized Booster code into the repo')
      .untilDisplayed();
    await launcher.importSetup.newProjectBoosterOkIcon('Configuring to trigger builds on Git pushes').untilDisplayed();
    await launcher.importSetup.newProjectBoosterOkIcon('Setting up your build pipeline').untilDisplayed();
    await launcher.importSetup.newProjectBoosterOkIcon('Setting up your codebase')
      .untilDisplayed();
    await launcher.importSetup.clickViewNewApplicationButton();
    await launcher.appHeader.untilTextIsPresent('Analyze');
    expect (await browser.getTitle()).toContain('Analyze');
  });

});
