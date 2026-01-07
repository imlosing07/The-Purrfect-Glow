'use client';

import { OrderStatus } from '@/src/types';

interface StatusBadgeProps {
    status: OrderStatus;
    size?: 'sm' | 'md' | 'lg';
}

const statusConfig: Record<OrderStatus, { label: string; bg: string; text: string; icon: string }> = {
    [OrderStatus.PENDING]: {
        label: 'Pendiente',
        bg: 'bg-status-pending',
        text: 'text-brand-brown',
        icon: '⏳',
    },
    [OrderStatus.SHIPPED]: {
        label: 'Enviado',
        bg: 'bg-status-shipped',
        text: 'text-blue-800',
        icon: '📦',
    },
    [OrderStatus.DELIVERED]: {
        label: 'Entregado',
        bg: 'bg-status-delivered',
        text: 'text-green-800',
        icon: '✅',
    },
};

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
    const config = statusConfig[status];

    const sizeClasses = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-3 py-1 text-sm',
        lg: 'px-4 py-1.5 text-base',
    };

    return (
        <span
            className={`
        inline-flex items-center gap-1.5 rounded-full font-nunito font-medium
        ${config.bg} ${config.text} ${sizeClasses[size]}
      `}
        >
            <span>{config.icon}</span>
            <span>{config.label}</span>
        </span>
    );
}

// Status selector component for changing order status
interface StatusSelectorProps {
    currentStatus: OrderStatus;
    onStatusChange: (status: OrderStatus) => void;
    disabled?: boolean;
}

export function StatusSelector({ currentStatus, onStatusChange, disabled = false }: StatusSelectorProps) {
    const statuses: OrderStatus[] = [OrderStatus.PENDING, OrderStatus.SHIPPED, OrderStatus.DELIVERED];

    return (
        <div className="flex gap-2 flex-wrap">
            {statuses.map((status) => {
                const config = statusConfig[status];
                const isActive = currentStatus === status;

                return (
                    <button
                        key={status}
                        onClick={() => onStatusChange(status)}
                        disabled={disabled || isActive}
                        className={`
              px-3 py-1.5 rounded-full text-sm font-nunito font-medium
              transition-all duration-200
              ${isActive
                                ? `${config.bg} ${config.text} ring-2 ring-offset-2 ring-brand-brown/20`
                                : 'bg-white text-brand-brown/60 hover:bg-brand-cream border border-brand-cream-dark'
                            }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
                    >
                        <span className="mr-1">{config.icon}</span>
                        {config.label}
                    </button>
                );
            })}
        </div>
    );
}
