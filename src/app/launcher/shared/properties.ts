import * as _ from 'lodash';

export class PropertiesGetter {
  constructor(private object: any) {}
  mapKeys(props: any, base: string = ''): any {
    Object.keys(props).forEach(key => {
      if (typeof props[key] === 'object') {
        this.mapKeys(props[key], key);
      } else {
        props[key] = _.get(this.object, (base ? base + '.' : '') + _.get(props, key));
      }
    });
    return props;
  }
}
