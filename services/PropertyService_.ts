// services/PropertyService.ts (updated for Supabase)
import { PropertiesRepository } from '@/lib/repositories/PropertiesRepository';
import { PropertyData } from '@/types/property';

export class PropertyService {
  private repository: PropertiesRepository;

  constructor() {
    this.repository = new PropertiesRepository();
  }

  async create(property: Omit<PropertyData, "id">) {
    return await this.repository.create(property);
  }

  async update(id: string, property: Partial<PropertyData>) {
    return await this.repository.update(id, property);
  }

  async delete(id: string) {
    return await this.repository.delete(id);
  }

  async getById(id: string) {
    return await this.repository.getById(id);
  }

  async getAll() {
    return await this.repository.getAll();
  }

  async getPaged(options: any) {
    return await this.repository.getPaged(options);
  }
}