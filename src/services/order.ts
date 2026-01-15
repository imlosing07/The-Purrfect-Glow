// src/services/order.ts
// Servicio de órdenes para The Purrfect Glow

import { prismaClientGlobal } from '@/src/app/lib/prisma';
import { CreateOrderDTO, Order, OrderResponse, OrderStatus } from '@/src/types';
import { generateWhatsAppLink } from '@/src/utils/whatsapp';
import { getShippingRate } from './shipping';

// Include para obtener items con productos
const orderInclude = {
  items: {
    include: {
      product: true
    }
  }
};

/**
 * Transforma orden de DB a tipo frontend
 */
function transformOrderFromDB(order: any): Order {
  return {
    ...order,
    items: order.items.map((item: any) => ({
      ...item,
      product: item.product
    }))
  };
}

/**
 * Crea una nueva orden y genera el link de WhatsApp
 */
export async function createOrder(data: CreateOrderDTO): Promise<OrderResponse> {
  try {
    // 1. Obtener los productos y verificar disponibilidad
    const productIds = data.items.map(item => item.productId);
    const products = await prismaClientGlobal.product.findMany({
      where: { 
        id: { in: productIds },
        isAvailable: true
      }
    });

    if (products.length !== productIds.length) {
      throw new Error('Algunos productos no están disponibles');
    }

    // 2. Crear mapa de productos para acceso rápido
    const productMap = new Map(products.map(p => [p.id, p]));

    // 3. Calcular subtotal
    let subtotal = 0;
    const orderItems = data.items.map(item => {
      const product = productMap.get(item.productId)!;
      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;
      return {
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: product.price
      };
    });

    // 4. Obtener costo de envío
    const shippingRate = await getShippingRate(data.shippingZone, data.shippingModality);
    if (!shippingRate) {
      throw new Error('Tarifa de envío no encontrada');
    }

    const shippingCost = shippingRate.cost;
    const totalAmount = subtotal + shippingCost;

    // 5. Crear la orden en la base de datos
    const order = await prismaClientGlobal.order.create({
      data: {
        dni: data.dni,
        fullName: data.fullName,
        phone: data.phone,
        address: data.address,
        department: data.department,
        province: data.province,
        shippingZone: data.shippingZone,
        shippingModality: data.shippingModality,
        subtotal,
        shippingCost,
        totalAmount,
        status: 'PENDING',
        items: {
          create: orderItems
        }
      },
      include: orderInclude
    });

    // 6. Generar link de WhatsApp
    const whatsappLink = generateWhatsAppLink({
      customerName: data.fullName,
      dni: data.dni,
      phone: data.phone,
      items: data.items.map(item => {
        const product = productMap.get(item.productId)!;
        return {
          name: product.name,
          quantity: item.quantity,
          price: product.price * item.quantity
        };
      }),
      shippingZone: data.shippingZone,
      shippingModality: data.shippingModality,
      shippingCost,
      estimatedDays: shippingRate.estimatedDays,
      totalAmount
    });

    // 7. Actualizar la orden con el link de WhatsApp
    await prismaClientGlobal.order.update({
      where: { id: order.id },
      data: { whatsappLink }
    });

    return {
      orderId: order.id,
      whatsappLink,
      order: transformOrderFromDB({ ...order, whatsappLink })
    };
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

/**
 * Obtiene una orden por ID
 */
export async function getOrderById(id: string): Promise<Order | null> {
  try {
    const order = await prismaClientGlobal.order.findUnique({
      where: { id },
      include: orderInclude
    });

    if (!order) return null;

    return transformOrderFromDB(order);
  } catch (error) {
    console.error(`Error fetching order ${id}:`, error);
    throw new Error(`Failed to fetch order ${id}`);
  }
}

/**
 * Actualiza el estado de una orden (para admin - un clic)
 */
export async function updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
  try {
    const order = await prismaClientGlobal.order.update({
      where: { id },
      data: { status },
      include: orderInclude
    });

    return transformOrderFromDB(order);
  } catch (error) {
    console.error(`Error updating order ${id} status:`, error);
    throw new Error(`Failed to update order status`);
  }
}

/**
 * Obtiene todas las órdenes con filtros opcionales (optimized for list view)
 */
export async function getOrders(options: {
  status?: OrderStatus;
  page?: number;
  limit?: number;
} = {}): Promise<{ orders: Order[]; total: number }> {
  const { status, page = 1, limit = 20 } = options;

  try {
    const where = status ? { status } : {};

    const [orders, total] = await Promise.all([
      prismaClientGlobal.order.findMany({
        where,
        select: {
          id: true,
          dni: true,
          fullName: true,
          phone: true,
          address: true,
          department: true,
          province: true,
          shippingZone: true,
          shippingModality: true,
          subtotal: true,
          shippingCost: true,
          totalAmount: true,
          status: true,
          whatsappLink: true,
          createdAt: true,
          updatedAt: true,
          items: {
            select: {
              id: true,
              quantity: true,
              unitPrice: true,
              product: {
                select: {
                  id: true,
                  name: true,
                  images: true,
                  price: true
                }
              }
            }
          }
        },
        take: limit,
        skip: (page - 1) * limit,
        orderBy: { createdAt: 'desc' }
      }),
      prismaClientGlobal.order.count({ where })
    ]);

    return {
      orders: orders.map(transformOrderFromDB),
      total
    };
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw new Error('Failed to fetch orders');
  }
}

/**
 * Cuenta órdenes por estado (para dashboard)
 */
export async function getOrdersCountByStatus(): Promise<Record<OrderStatus, number>> {
  try {
    const counts = await prismaClientGlobal.order.groupBy({
      by: ['status'],
      _count: { status: true }
    });

    const result: Record<OrderStatus, number> = {
      PENDING: 0,
      SHIPPED: 0,
      DELIVERED: 0
    };

    for (const count of counts) {
      result[count.status as OrderStatus] = count._count.status;
    }

    return result;
  } catch (error) {
    console.error('Error counting orders by status:', error);
    throw new Error('Failed to count orders');
  }
}
