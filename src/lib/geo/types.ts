export interface LocationData {
  country_name: string;
  country_code: string; // ISO-2 (LB, US)
  country_code_iso3?: string;
  city?: string;
  region?: string;
  ip?: string;
}
