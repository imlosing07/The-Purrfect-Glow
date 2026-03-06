// src/utils/whatsapp.ts
// Utilidad para generar links de WhatsApp con mensajes pre-formateados

import { ShippingModality, ShippingZone, SHIPPING_ZONES_INFO, SHIPPING_MODALITY_INFO } from '@/src/types';

export interface WhatsAppOrderData {
  orderNumber: string;
  customerName: string;
  dni: string;
  phone: string;
  items: { name: string; quantity: number; price: number }[];
  // Dirección de envío
  address?: string;
  department?: string;
  province?: string;
  district?: string;
  reference?: string;
  locationUrl?: string;
  // Shipping
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

  // Usamos CodePoints para que no haya emojis reales en el archivo .ts
  const flower = String.fromCodePoint(0x1F338); // 🌸
  const sparkle = String.fromCodePoint(0x2728); // ✨
  const box = String.fromCodePoint(0x1F4E6);    // 📦
  const user = String.fromCodePoint(0x1F464);   // 👤
  const truck = String.fromCodePoint(0x1F69A);  // 🚚
  const money = String.fromCodePoint(0x1F4B0);  // 💰
  const paws = String.fromCodePoint(0x1F43E);   // 🐾
  const cat = String.fromCodePoint(0x1F431);    // 🐱
  const pin = String.fromCodePoint(0x1F4CD);    // 📍
  const mapIcon = String.fromCodePoint(0x1F5FA); // 🗺️

  const itemsList = data.items
    .map(item => `${sparkle} *${item.name}* (x${item.quantity})`)
    .join('\n');

  // Construir destino legible: "Arequipa, Arequipa, Alto Selva Alegre"
  let destino = '';
  if (data.department) {
    destino = data.department;
    if (data.province) destino += `, ${data.province}`;
    if (data.district) destino += `, ${data.district}`;
  }

  // Dirección completa, referencia y ubicación Maps
  let addressBlock = '';
  if (data.address) {
    addressBlock += `\n${pin} Direccion: ${data.address}`;
    if (data.reference) addressBlock += `\n${pin} Referencia: ${data.reference}`;
    if (data.locationUrl) addressBlock += `\n${mapIcon} Ubicacion Maps: ${data.locationUrl}`;
  }

  const message = `Hola Solicorn! ${flower}${cat}

He elegido estos productos para mi *Purrfect Glow*:

---------------------------
${box} *PEDIDO #${data.orderNumber}*
${itemsList}
---------------------------

${user} *MIS DATOS:*
- Nombre: ${data.customerName}
- DNI: ${data.dni}
- Cel: ${data.phone}

${truck} *DETALLES DE ENVIO:*
- Destino: ${destino || 'No especificado'}
- Costo: S/ ${data.shippingCost.toFixed(2)}
- Entrega estimada: ${data.estimatedDays}${addressBlock}

${money} *TOTAL A PAGAR: S/ ${data.totalAmount.toFixed(2)}*

Quedo atento(a) para que me indiques los metodos de pago. Gracias! ${paws}`;

  // IMPORTANTE: Usar api.whatsapp.com/send en lugar de wa.me para evitar redirección que corrompe encoding
  const encodedText = encodeURIComponent(message);

  return `https://api.whatsapp.com/send?phone=${solicornPhone}&text=${encodedText}`;
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
