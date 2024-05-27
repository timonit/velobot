import type { EntityDTO } from './entity.dto';

export abstract class Entity<T extends EntityDTO> {
  dto: T;

  get id() {
    return this.dto.id; 
  }

  constructor(dto: T) {
    this.dto = dto;
  }
}
