'use client';

import { motion } from 'framer-motion';

interface ToggleProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export default function Toggle({ checked, onChange, disabled = false, size = 'md' }: ToggleProps) {
    const sizes = {
        sm: { track: 'w-10 h-5', thumb: 'w-4 h-4', translate: 'translate-x-5' },
        md: { track: 'w-12 h-6', thumb: 'w-5 h-5', translate: 'translate-x-6' },
        lg: { track: 'w-14 h-7', thumb: 'w-6 h-6', translate: 'translate-x-7' },
    };

    const { track, thumb, translate } = sizes[size];

    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            disabled={disabled}
            onClick={() => !disabled && onChange(!checked)}
            className={`
        relative inline-flex items-center rounded-full p-0.5
        transition-colors duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2 focus:ring-offset-brand-cream
        ${track}
        ${checked ? 'bg-pastel-green' : 'bg-brand-cream-dark'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
        >
            <motion.span
                layout
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className={`
          ${thumb}
          rounded-full bg-white shadow-soft
          ${checked ? translate : 'translate-x-0'}
        `}
            />
        </button>
    );
}
