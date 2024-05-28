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
    return new this(dto);
  }
}
