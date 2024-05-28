export function injectable(token: string | Symbol) {
  return (target: Function) => {
    Reflect.defineMetadata(token, target, injectable);
  }
}
