import { DataResult, EntityId } from "./types";

export interface DataSource<T> {
  getById(id: EntityId): Promise<DataResult<T>>;
  create(data: T): Promise<DataResult<EntityId>>;
}
