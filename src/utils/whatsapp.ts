// src/utils/whatsapp.ts
// Utilidad para generar links de WhatsApp con mensajes pre-formateados

import { ShippingModality, ShippingZone, SHIPPING_ZONES_INFO, SHIPPING_MODALITY_INFO } from '@/src/types';

export interface WhatsAppOrderData {
  customerName: string;
  dni: string;
  phone: string;
  items: { name: string; quantity: number; price: number }[];
  shippingZone: ShippingZone;
  shippingModality: ShippingModality;
  shippingCost: number;
  estimatedDays: string;
  totalAmount: number;
}

/**
 * Genera un link de WhatsApp con un mensaje pre-formateado para Solicorn
 * @param data - Datos del pedido
 * @returns URL de WhatsApp codificada
 */
export function generateWhatsAppLink(data: WhatsAppOrderData): string {
  const solicornPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '51959619405';
  const subtotal = data.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const zoneInfo = SHIPPING_ZONES_INFO[data.shippingZone];
  const modalityInfo = SHIPPING_MODALITY_INFO[data.shippingModality];

  const itemsList = data.items
    .map(item => `✨ *${item.name}* (x${item.quantity})`)
    .join('\n');

  // Mensaje optimizado para conversión y legibilidad
  const message = `¡Hola Solicorn! 🌸✨

He elegido estos productos para mi *Purrfect Glow*:

---------------------------
*RESUMEN DEL PEDIDO: *
${itemsList}
---------------------------

👤 *MIS DATOS:*
- Nombre: ${data.customerName}
- DNI: ${data.dni}
- Cel: ${data.phone}

🚚 *DETALLES DE ENVÍO:*
- Destino: ${zoneInfo.label} (${modalityInfo.label})
- Costo: S/ ${data.shippingCost.toFixed(2)}
- Entrega estimada: ${data.estimatedDays}

💰 *TOTAL A PAGAR: S/ ${data.totalAmount.toFixed(2)}*

Quedo atento(a) para que me indiques los métodos de pago y asegurar mi pedido. ¡Muchas gracias! 🐾💕`;

  return `https://wa.me/${solicornPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Genera un link de WhatsApp simple para consultas
 * @param productName - Nombre del producto
 * @returns URL de WhatsApp codificada
 */
export function generateProductInquiryLink(productName: string): string {
  const solicornPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '51959619405';
  
  const message = `¡Hola Solicorn! 🌸

Me interesa el producto: *${productName}*

¿Podrías darme más información? 💕`;

  const encodedMessage = encodeURIComponent(message);
  
  return `https://wa.me/${solicornPhone}?text=${encodedMessage}`;
}
