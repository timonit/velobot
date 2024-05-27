export abstract class Feature {
  abstract execute(dto?: any): any;

  static instace<T extends Feature>(this: new () => T): T {
    return new this();
  }
}
