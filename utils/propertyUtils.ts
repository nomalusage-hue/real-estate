// utils/propertyUtils.ts
// import { PropertyWithId } from '@/components/property/types';
import { PropertyData } from '@/types/property';

export const getPropertyDisplayPrice = (property: PropertyData): string => {
  const parts = [];
  
  if (property.salePrice && property.status?.includes('For Sale')) {
    parts.push(`$${property.salePrice.toLocaleString()}`);
  }
  
  if (property.rentPrice && property.status?.includes('For Rent')) {
    parts.push(`$${property.rentPrice.toLocaleString()}/month`);
  }
  
  if (property.status?.includes('Sold')) {
    parts.push('Sold');
  }
  
  return parts.join(' • ') || 'Price on request';
};

export const getPropertyBadges = (property: PropertyData): string[] => {
  const badges = [];
  
  if (property.status?.includes('For Sale')) badges.push('for-sale');
  if (property.status?.includes('For Rent')) badges.push('for-rent');
  if (property.hot) badges.push('hot');
  if (property.featured) badges.push('featured');
  if (property.exclusive) badges.push('exclusive');
  if (property.newListing) badges.push('new');
  
  return badges;
};

export const formatPropertySize = (property: PropertyData): string => {
  if (property.buildingSize) {
    return `${property.buildingSize.toLocaleString()} ${property.sizeUnit}`;
  }
  return '';
};