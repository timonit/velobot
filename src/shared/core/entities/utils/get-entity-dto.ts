import type { Entity } from '../entity';

export type GetEntityDTO<T> = T extends Entity<infer DTO> ? DTO : any;
