import { injectable } from '../injectable';

export abstract class Feature {
  abstract execute(dto?: any): any;

  static instace<T extends Feature>(this: new () => T): T {
    const instance = new this();
    const keys = Reflect.getMetadataKeys(instance);

    keys.forEach((key) => {
      const prop = Reflect.getMetadata(key, instance);
      const ctr = Reflect.getMetadata(key, injectable);

      // @ts-ignore
      instance[prop] = new ctr();
    });

    return instance;
  }
}
