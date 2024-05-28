import { injectable } from '../injectable';

export abstract class Feature {
  constructor() {
    const keys = Reflect.getMetadataKeys(this);

    keys.forEach((key) => {
      const prop = Reflect.getMetadata(key, this);
      const ctr = Reflect.getMetadata(key, injectable);

      // @ts-ignore
      this[prop] = new ctr();
    });
  }

  abstract execute(dto?: any): any;

  static instace<T extends Feature>(this: new () => T): T {
    return new this();
  }
}
