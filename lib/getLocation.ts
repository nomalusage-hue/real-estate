// lib/getLocation.ts
export async function getUserCountry(ipAddress: string) {
  try {
    // Replace with a reliable API service and your key
    const response = await fetch(`api.ipinfo.io{ipAddress}?token=YOUR_API_KEY`);
    const data = await response.json();
    return data.country; // e.g., "US"
  } catch (error) {
    console.error("Error fetching location:", error);
    return null;
  }
}

// In a Server Action or Route Handler:
import { headers } from 'next/headers';

export default async function myServerAction() {
  const headersList = headers();
  // Standard way to get the client IP from forwarded headers
  const ip = headersList.get('x-forwarded-for')?.split(',')[0] || headersList.get('x-real-ip');

  if (ip) {
    const country = await getUserCountry(ip);
    // Use the country data
  }
}
