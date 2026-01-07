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
  
  // Formatear lista de productos
  const itemsList = data.items
    .map(item => `   • ${item.name} x${item.quantity} — S/ ${item.price.toFixed(2)}`)
    .join('\n');

  // Calcular subtotal
  const subtotal = data.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Obtener info de zona y modalidad
  const zoneInfo = SHIPPING_ZONES_INFO[data.shippingZone];
  const modalityInfo = SHIPPING_MODALITY_INFO[data.shippingModality];

  const message = `¡Hola Solicorn! 🌸✨

Soy *${data.customerName}*
📄 DNI: ${data.dni}
📱 Teléfono: ${data.phone}

━━━━━━━━━━━━━━━━━━━━━━
📦 *MI PEDIDO:*
${itemsList}

━━━━━━━━━━━━━━━━━━━━━━
💵 Subtotal: S/ ${subtotal.toFixed(2)}
🚚 Envío (${zoneInfo.label} - ${modalityInfo.label}): S/ ${data.shippingCost.toFixed(2)}
⏱️ Tiempo estimado: ${data.estimatedDays}

💰 *TOTAL: S/ ${data.totalAmount.toFixed(2)}*
━━━━━━━━━━━━━━━━━━━━━━

¿Me confirmas los datos para coordinar el envío por Olva? 🐱💕`;

  const encodedMessage = encodeURIComponent(message);
  
  return `https://wa.me/${solicornPhone}?text=${encodedMessage}`;
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
