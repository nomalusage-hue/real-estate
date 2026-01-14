export type EntityId = string;

export interface Property {
  id: EntityId;
  title: string;
  price: number;
  imageUrl?: string;
}

export interface DataResult<T> {
  ok: boolean;
  data?: T;
  error?: string;
}
