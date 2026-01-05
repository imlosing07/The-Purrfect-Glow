'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export interface CartItem {
  productId: string;
  productName: string;
  productImage: string;
  brandName: string;
  size: string;
  price: number;
  salePrice?: number;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  cartCount: number;
  totalPrice: number;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: string, size: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Cargar carrito desde localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        setItems(parsed);
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Guardar carrito en localStorage cada vez que cambie
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('cart', JSON.stringify(items));
      // Disparar evento para que otros componentes se enteren
      window.dispatchEvent(new Event('storage'));
    }
  }, [items, isLoaded]);

  const addToCart = useCallback((newItem: Omit<CartItem, 'quantity'>) => {
    setItems(currentItems => {
      // Buscar si ya existe el producto con esa talla
      const existingIndex = currentItems.findIndex(
        item => item.productId === newItem.productId && item.size === newItem.size
      );

      if (existingIndex >= 0) {
        // Si existe, incrementar cantidad
        const updatedItems = [...currentItems];
        updatedItems[existingIndex].quantity += 1;
        return updatedItems;
      } else {
        // Si no existe, agregar nuevo
        return [...currentItems, { ...newItem, quantity: 1 }];
      }
    });
  }, []);

  const removeFromCart = useCallback((productId: string, size: string) => {
    setItems(currentItems =>
      currentItems.filter(item => !(item.productId === productId && item.size === size))
    );
  }, []);

  const updateQuantity = useCallback((productId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }

    setItems(currentItems =>
      currentItems.map(item =>
        item.productId === productId && item.size === size
          ? { ...item, quantity }
          : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const isInCart = useCallback((productId: string, size: string): boolean => {
    return items.some(item => item.productId === productId && item.size === size);
  }, [items]);

  // Calcular totales
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => {
    const price = item.salePrice || item.price;
    return sum + (price * item.quantity);
  }, 0);

  const value: CartContextType = {
    items,
    cartCount,
    totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}