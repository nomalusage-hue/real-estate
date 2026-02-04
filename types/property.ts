// export interface PropertyData {
//   id: string;
//   title: string;
//   price: number;
//   image: string;
//   location: string;

  
//   rooms?: number;
//   beds?: number;
//   baths?: number;
//   areaSize?: number;
//   areaUnit?: "m2" | "ft2";

//   ownerName?: string;
//   ownerEmail?: string;
//   ownerPhone?: string;

//   featured?: boolean;
//   premium?: boolean;
//   hot?: boolean;
//   newListing?: boolean;
//   exclusive?: boolean;
//   openHouse?: boolean;
// }




// export interface PropertyData {
//   id: string;

//   title: string;
//   description: string;

//   propertyType: "house" | "apartment" | "villa" | "commercial" | "land";

//   price: number;
//   status: "For Sale" | "For Rent" | "Sold";

//   // Location
//   address: string;
//   city: string;
//   showAddress: boolean;

//   // Gallery
//   images: string[];

//   // House/Building Stats (optional for land)
//   bedrooms?: number;
//   bathrooms?: number;
//   areaSize?: number;
//   areaUnit?: "m2" | "ft2";
//   yearBuilt?: number;
//   garage?: number;

//   // Land-specific
//   lotSize?: number;
//   lotSizeUnit?: "m2" | "ft2" | "acre" | "hectare";
//   zoning?: string;
//   utilities?: {
//     water?: boolean;
//     electricity?: boolean;
//     sewage?: boolean;
//     roadAccess?: boolean;
//   };

//   // Labels
//   hot?: boolean;
//   newListing?: boolean;
//   featured?: boolean;
//   exclusive?: boolean;

//   // Amenities (optional for land)
//   interiorFeatures?: string[];
//   exteriorFeatures?: string[];

//   // Agent
//   showAgent: boolean;
//   agent?: {
//     name: string;
//     title?: string;
//     phone?: string;
//     email?: string;
//     photo?: string;
//   };
// }



export interface PropertyData {
  id: string;
  
  title: string;
  description: string;
  
  propertyType: "house" | "apartment" | "villa" | "commercial" | "land";
  
  // Multiple status support (array instead of single)
  status: ("For Sale" | "For Rent" | "Sold")[];
  
  // Separate prices for different statuses
  salePrice?: number;  // Only when status includes "For Sale"
  rentPrice?: number;  // Only when status includes "For Rent"
  // Note: No price needed for "Sold" status

  saleCurrency?: string;
  rentCurrency?: string;
  
  // Location
  address: string;
  city: string;
  showAddress: boolean;
  
  // Gallery
  images: string[];
  
  // House/Building Stats (optional for land)
  bedrooms?: number;
  bathrooms?: number;
  buildingSize?: number;  // Renamed from areaSize
  sizeUnit: "m2" | "ft2" | "sqm" | "sqft" | "acre" | "hectare";  // Updated from areaUnit
  yearBuilt?: number;
  garage?: number;
  
  // Land-specific properties (now also used for houses/villas with land)
  landSize?: number;  // For total property area including outdoor spaces
  zoning?: string;
  utilities?: {
    water?: boolean;
    electricity?: boolean;
    sewage?: boolean;
    roadAccess?: boolean;
  };
  
  // Labels
  hot?: boolean;
  newListing?: boolean;
  featured?: boolean;
  exclusive?: boolean;
  
  // Features
  interiorFeatures?: string[];
  exteriorFeatures?: string[];
  customFeatures?: string[];  // Added for custom features
  
  // Media (optional)
  videoUrl?: string;
  virtualTourUrl?: string;
  
  // Agent
  showAgent: boolean;
  agent?: {
    name: string;
    title?: string;
    phone?: string;
    email?: string;
    photo?: string;
  };
  
  // Timestamps
  createdAt?: string;
  updatedAt?: string;
  published?: boolean;
  draft?: boolean;  // For saved drafts
  
  // Additional metadata
  views?: number;
  favorites?: number;
}

// export interface PropertyWithId extends PropertyData {
//   id: string; // This comes from Firebase document ID
// }

export interface TourRequest {
  id: string;
  propertyId: string;
  name: string;
  email: string;
  phone: string;
  message?: string;
  createdAt: string;
}