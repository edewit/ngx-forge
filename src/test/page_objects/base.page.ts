import { $, $$, browser, ExpectedConditions } from 'protractor';
import * as mixins from '../mixins';
import * as support from '../support';
import { DEFAULT_WAIT } from '../support';
import { BaseElementArray, Button, TextInput } from '../ui';

export enum PageOpenMode {
  AlreadyOpened,
  RefreshBrowser
}

export abstract class BasePage {

  navBarLogin = new Button($('#login'), 'nav bar login');
  usernameInput = new TextInput($('#username'), 'username');
  passwordInput = new TextInput($('#password'), 'password');
  loginButton = new Button($('#kc-login'), 'Login');
  progress = new BaseElementArray($$('.progress'), 'progressBar');

  name: string = '...';
  log: (action: string, ...msg: string[]) => void;
  debug: (context: string, ...msg: string[]) => void;

  // Use undefined to indicate the url has not been set
  // It will use be in openInBrowser to throw error if the caller forgot
  // to set the url. Need to do this because '' is a valid url and
  // refers to the baseUrl
  protected url: string | undefined;

  constructor(url?: string) {
    this.url = url;
    this.debug(`url: '${url}'`);
  }

  async ready() {
  }


  async open(mode: PageOpenMode =  PageOpenMode.AlreadyOpened): Promise<BasePage> {

    if (mode === PageOpenMode.RefreshBrowser) {
      await this.openInBrowser();
    }

    await this.ready();
    this.log('Opened');
    return this;
  }

  async openInBrowser() {
    if (this.url === undefined) {
      throw Error('Trying to open an undefined url');
    }
    this.log('Authenticating with Auth and Refresh token');
    await this.login(process.env.EE_TEST_USERNAME, process.env.EE_TEST_PASSWORD);
    this.log('Opening', this.url);
    let currentUrl = await browser.getCurrentUrl();
    this.debug('at  :', currentUrl);

    this.debug(`goto: '${this.url}'`);
    await browser.get(this.url);

    let urlNow = await browser.getCurrentUrl();
    this.debug('now :', urlNow);
  }

  async login(username: string, password: string): Promise<void> {
    this.log('base url set');
    await browser.get(browser.baseUrl);
    await browser.sleep(5000);
    this.log('progress count 0');
    await this.progress.untilCount(0);
    this.log('click nav bar');
    await this.navBarLogin.clickWhenReady();
    await this.loginButton.untilTextIsPresentInValue('Log in');
    this.debug('... Login: input details and click Login');
    await this.usernameInput.enterText(username);
    await this.passwordInput.enterText(password);
    await this.loginButton.clickWhenReady();
    await this.waitUntilUrlContains('_home');
  }

  async waitUntilUrlContains(text: string, timeout?: number) {
    await browser.wait(ExpectedConditions.urlContains(text), timeout);
  }
}

mixins.applyMixins(BasePage, [mixins.Logging]);
