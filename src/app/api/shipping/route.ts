// src/app/api/shipping/route.ts
// API de tarifas de envío Olva

import { NextRequest, NextResponse } from 'next/server';
import { getShippingRates, getAllShippingZones, SHIPPING_DISCLAIMER } from '@/src/services/shipping';
import { ShippingZone } from '@/src/types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const zone = searchParams.get('zone') as ShippingZone | null;
    
    // Si se proporciona una zona, devolver tarifas para esa zona
    if (zone) {
      const validZones: ShippingZone[] = [
        'LIMA_LOCAL', 
        'LIMA_PROVINCIAS', 
        'COSTA_NACIONAL', 
        'SIERRA_SELVA', 
        'ZONAS_REMOTAS'
      ];
      
      if (!validZones.includes(zone)) {
        return NextResponse.json(
          { error: 'Invalid shipping zone' },
          { status: 400 }
        );
      }
      
      const rates = await getShippingRates(zone);
      
      return NextResponse.json({
        ...rates,
        disclaimer: SHIPPING_DISCLAIMER
      });
    }
    
    // Si no se proporciona zona, devolver todas las zonas con sus tarifas
    const allZones = await getAllShippingZones();
    
    return NextResponse.json({
      zones: allZones,
      disclaimer: SHIPPING_DISCLAIMER
    });
  } catch (error) {
    console.error('Error in GET /api/shipping:', error);
    return NextResponse.json(
      { error: 'Error fetching shipping rates' },
      { status: 500 }
    );
  }
}
