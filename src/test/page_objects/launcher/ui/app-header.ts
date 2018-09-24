import * as ui from '../../../ui' ;


export class AppHeader extends ui.BaseElement {
  createSpace = new ui.Dropdown(
    this.$('#header_dropdownToggle'),
    this.$('.dropdown-menu.recent-items'),
    'create space dropdown'
  );

  async selectCreateSpace(item: string) {
    await this.createSpace.clickWhenReady();
    await this.createSpace.select(item);
  }
}
