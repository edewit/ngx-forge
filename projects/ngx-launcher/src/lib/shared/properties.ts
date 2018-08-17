import * as _ from 'lodash';

export class PropertiesGetter {
  private dataObj: any = {};
  constructor(private object: any, private args: string[] = []) { }
  mapKeys(props: any, base: string = ''): any {
    Object.keys(props).forEach(key => {
      const index = _.get(props, key);
      if (typeof props[key] === 'object') {
        this.mapKeys(props[key], (base ? base + '.' : '') + key);
      } else if (/\[[0-9]*\]/.exec(index)) {
        this.dataObj[key] = _.get(this.args, index);
      } else {
        this.dataObj[key] = _.get(this.object, (base ? base + '.' : '') + index);
      }
    });
    return this.dataObj;
  }
}
