// // app/api/properties/route.js
// import { databaseService, imageService } from '@/lib/initServices';

// // GET all properties
// export async function GET(request) {
//   try {
//     const { searchParams } = new URL(request.url);
    
//     const filters = {
//       propertyType: searchParams.get('type'),
//       status: searchParams.get('status'),
//       city: searchParams.get('city'),
//       minPrice: searchParams.get('minPrice'),
//       maxPrice: searchParams.get('maxPrice'),
//       bedrooms: searchParams.get('bedrooms'),
//       bathrooms: searchParams.get('bathrooms')
//     };
    
//     const pagination = {
//       page: parseInt(searchParams.get('page') || '1'),
//       limit: parseInt(searchParams.get('limit') || '12'),
//       sortBy: searchParams.get('sortBy') || 'createdAt',
//       sortOrder: searchParams.get('sortOrder') || 'desc'
//     };
    
//     const result = await databaseService.getProperties(filters, pagination);
    
//     return Response.json(result);
//   } catch (error) {
//     return Response.json(
//       { error: error.message },
//       { status: 500 }
//     );
//   }
// }

// // POST create new property
// export async function POST(request) {
//   try {
//     const data = await request.json();
    
//     // Upload images if provided
//     if (data.images && data.images.length > 0) {
//       // Note: In real implementation, you'd need to handle file uploads differently
//       // This assumes image URLs are already uploaded
//     }
    
//     const property = await databaseService.createProperty(data, data.userId);
    
//     return Response.json(property, { status: 201 });
//   } catch (error) {
//     return Response.json(
//       { error: error.message },
//       { status: 500 }
//     );
//   }
// }