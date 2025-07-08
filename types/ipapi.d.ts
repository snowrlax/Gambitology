declare module 'ipapi.co' {
  interface LocationData {
    ip: string;
    city: string;
    region: string;
    country: string;
    country_name: string;
    continent_code: string;
    continent: string;
    latitude: number;
    longitude: number;
    timezone: string;
    utc_offset: string;
    country_calling_code: string;
    currency: string;
    currency_name: string;
    languages: string;
    country_area: number;
    country_population: number;
    asn: string;
    org: string;
    error?: boolean;
    reason?: string;
  }

  interface Ipapi {
    location: (callback: (data: LocationData) => void, ip?: string) => void;
  }

  const ipapi: Ipapi;
  export default ipapi;
} 