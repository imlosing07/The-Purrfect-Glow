// src/services/shipping.ts
// Servicio de tarifas de envío Olva

import { prismaClientGlobal } from '@/src/app/lib/prisma';
import { ShippingZone, ShippingModality, ShippingResponse } from '@/src/types';

/**
 * Obtiene las tarifas de envío para una zona
 * Retorna ambas modalidades (domicilio y agencia) y el ahorro
 */
export async function getShippingRates(zone: ShippingZone): Promise<ShippingResponse> {
  try {
    const rates = await prismaClientGlobal.shippingRate.findMany({
      where: { zone }
    });

    const domicilio = rates.find(r => r.modality === 'DOMICILIO');
    const agencia = rates.find(r => r.modality === 'AGENCIA');

    if (!domicilio) {
      throw new Error(`No shipping rate found for zone: ${zone}`);
    }

    return {
      domicilio: {
        cost: domicilio.cost,
        estimatedDays: domicilio.estimatedDays
      },
      agencia: agencia ? {
        cost: agencia.cost,
        estimatedDays: agencia.estimatedDays
      } : null,
      savings: agencia ? domicilio.cost - agencia.cost : 0
    };
  } catch (error) {
    console.error(`Error fetching shipping rates for zone ${zone}:`, error);
    throw new Error(`Failed to fetch shipping rates for zone ${zone}`);
  }
}

/**
 * Obtiene una tarifa específica por zona y modalidad
 */
export async function getShippingRate(
  zone: ShippingZone, 
  modality: ShippingModality
): Promise<{ cost: number; estimatedDays: string } | null> {
  try {
    const rate = await prismaClientGlobal.shippingRate.findUnique({
      where: {
        zone_modality: { zone, modality }
      }
    });

    if (!rate) return null;

    return {
      cost: rate.cost,
      estimatedDays: rate.estimatedDays
    };
  } catch (error) {
    console.error(`Error fetching shipping rate:`, error);
    throw new Error('Failed to fetch shipping rate');
  }
}

/**
 * Obtiene todas las zonas de envío disponibles
 */
export async function getAllShippingZones(): Promise<{
  zone: ShippingZone;
  domicilioCost: number;
  agenciaCost: number | null;
}[]> {
  try {
    const rates = await prismaClientGlobal.shippingRate.findMany({
      orderBy: { zone: 'asc' }
    });

    // Agrupar por zona
    const zonesMap = new Map<ShippingZone, { domicilio?: number; agencia?: number }>();
    
    for (const rate of rates) {
      const current = zonesMap.get(rate.zone) || {};
      if (rate.modality === 'DOMICILIO') {
        current.domicilio = rate.cost;
      } else {
        current.agencia = rate.cost;
      }
      zonesMap.set(rate.zone, current);
    }

    return Array.from(zonesMap.entries()).map(([zone, costs]) => ({
      zone,
      domicilioCost: costs.domicilio || 0,
      agenciaCost: costs.agencia || null
    }));
  } catch (error) {
    console.error('Error fetching all shipping zones:', error);
    throw new Error('Failed to fetch shipping zones');
  }
}

/**
 * Mensaje informativo para mostrar en el checkout
 */
export const SHIPPING_DISCLAIMER = 
  'Tarifas basadas en paquetes de hasta 1kg. El monto final será revalidado al confirmar por WhatsApp.';
