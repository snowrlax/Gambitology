'use server'

import ipapi from "ipapi.co";
import prisma from "@/lib/db";
import { headers } from "next/headers";

// Helper function to parse forwarded headers
async function parseForwardedHeader(value: any) {
    if (!value) return [];
    return value.split(",").map((ip: any) => ip.trim());
}

// Reusable function to get enhanced IP
export async function getEnhancedIP() {
    const headersList = await headers();

    const sources = [
        headersList.get("x-forwarded-for"),
        headersList.get("x-real-ip"),
        headersList.get("cf-connecting-ip"), // Cloudflare
    ];

    for (const source of sources) {
        const ips = await parseForwardedHeader(source);
        if (ips?.length > 0) return ips[0];
    }

    return "127.0.0.1"; // Fallback for local development
}

// Reusable function to get location by IP
export async function getLocationByIP(ipAddress: string) {
    return new Promise((resolve, reject) => {
        const callback = function (location: any) {
            if (location.error) {
                reject(new Error(`API Error: ${location.reason}`));
                return;
            }
            resolve(location);
        };

        ipapi.location(callback, ipAddress);
    });
}

// Reusable function to get location with error handling
export async function getLocation(ipAddress: string) {
    // Skip location lookup for reserved IP addresses
    if (ipAddress === '127.0.0.1' || ipAddress === 'localhost' || ipAddress.startsWith('192.168.') || ipAddress.startsWith('10.')) {
        return {
            country: 'Unknown',
            city: 'Unknown',
            region: 'Unknown',
            lat: 0,
            lng: 0,
            timezone: 'Unknown',
            isp: 'Unknown'
        };
    }

    try {
        const location: any = await getLocationByIP(ipAddress);
        return location;
    } catch (error) {
        console.error('Error getting location:', error);
        return {
            country: 'Unknown',
            city: 'Unknown',
            region: 'Unknown',
            lat: 0,
            lng: 0,
            timezone: 'Unknown',
            isp: 'Unknown'
        };
    }
}

// Reusable function to save visitor data
export async function saveVisitorData(ipAddress: string, userAgent: string, location: any) {
    try {
        const visitor = await prisma.visitor.create({
            data: {
                ipAddress,
                location: {
                    ip: location.ip || '',
                    network: location.network || '',
                    version: location.version || '',
                    city: location.city || '',
                    region: location.region || '',
                    region_code: location.region_code || '',
                    country: location.country || '',
                    country_name: location.country_name || '',
                    country_code: location.country_code || '',
                    country_code_iso3: location.country_code_iso3 || '',
                    country_capital: location.country_capital || '',
                    country_tld: location.country_tld || '',
                    continent_code: location.continent_code || '',
                    in_eu: location.in_eu || false,
                    postal: location.postal || '',
                    latitude: location.latitude || 0,
                    longitude: location.longitude || 0,
                    timezone: location.timezone || '',
                    utc_offset: location.utc_offset || '',
                    country_calling_code: location.country_calling_code || '',
                    currency: location.currency || '',
                    currency_name: location.currency_name || '',
                    languages: location.languages || '',
                    country_area: location.country_area || 0,
                    country_population: location.country_population || 0,
                    asn: location.asn || '',
                    org: location.org || '',
                },
                device: userAgent
            }
        });
        return visitor;
    } catch (error) {
        console.error('Error saving visitor data:', error);
        throw error;
    }
}