import { injectable } from '../injectable';
import type { EntityDTO } from './entity.dto';
import type { GetEntityDTO } from './utils/get-entity-dto';

export abstract class Entity<T extends EntityDTO> {
  dto: T;

  get id() {
    return this.dto.id; 
  }

  constructor(dto: T) {
    this.dto = dto;
  }

  static instace<T extends Entity<GetEntityDTO<T>>>(
    this: new (dto: GetEntityDTO<T>) => T,
    dto: GetEntityDTO<T>
  ): T {
    const instance = new this(dto);
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
