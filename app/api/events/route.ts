import { NextRequest, NextResponse } from 'next/server';
import { getEnhancedIP, getLocation, saveVisitorData } from '@/actions/observability';

export async function POST(request: NextRequest) {
    try {
        // Get the IP address of the visitor
        const ipAddress = await getEnhancedIP();
        
        // Get the User-Agent from request headers
        const userAgent = request.headers.get('user-agent') || 'Unknown';
        
        // Get location data
        const location = await getLocation(ipAddress);
        
        // Save visitor data to database
        const savedVisitor = await saveVisitorData(ipAddress, userAgent, location);
        
        return NextResponse.json({
            success: true,
            data: {
                ipAddress,
                userAgent,
                location,
                visitorId: savedVisitor.id
            }
        });

    } catch (error) {
        console.error('Error processing visitor data:', error);
        return NextResponse.json(
            { 
                success: false, 
                error: 'Failed to process visitor data' 
            },
            { status: 500 }
        );
    }
}
