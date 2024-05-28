export function inject(token: string | Symbol) {
  return (target: any, propertyKey: string) => {
    Reflect.defineMetadata(token, propertyKey, target);
  }
}
