import { $ } from 'protractor';
import { AppPage } from '../app.page';
import * as support from '../../support';
import * as launcher from './ui';


export class LauncherPage extends AppPage {

  appHeader = new launcher.AppHeader($('alm-app-header'));
  createSpacePage = new launcher.CreateSpace($('f8-add-space-overlay'));
  createApplicationPage = new launcher.CreateApplication($('f8-add-app-overlay'));
  selectMissionRuntime =  new launcher.SelectMissionRuntime($('f8launcher-missionruntime-createapp-step'));
  selectDependencies = new launcher.SelectDependencies($('f8launcher-dependencychecker-createapp-step'));
  selectPipeline = new launcher.SelectPipeline($('f8launcher-releasestrategy-createapp-step'));
  gitProvider = new launcher.GitProvider($('f8launcher-gitprovider-createapp-step'));
  setup = new launcher.Setup($('f8launcher-projectsummary-createapp-step'));
  setupApp = new launcher.SetupApp($('f8launcher'));
  importGitProvider = new launcher.ImportGitProvider($('f8launcher-gitprovider-importapp-step'));
  importSelectPipeline = new launcher.ImportSelectPipeline($('f8launcher-releasestrategy-importapp-step'));
  importApplication = new launcher.ImportApplication($('f8launcher-projectsummary-importapp-step'));
  importSetup = new launcher.ImportSetup($('f8launcher'));

  constructor(url: string) {
    super(url);
  }

  async ready() {
    support.debug(' ... check if Launcher page is Ready');
    await super.ready();
    await this.appHeader.ready();
    support.debug(' ... check if Launcher page is Ready - OK');
  }

}
