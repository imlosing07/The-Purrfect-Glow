'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import {
    User,
    Phone,
    Mail,
    MapPin,
    Home,
    Package,
    AlertCircle
} from 'lucide-react';
import {
    getDepartamentos,
    getProvincias,
    getDistritos,
    getShippingZoneFromDepartamento
} from '@/src/app/lib/data/peruLocations';
import { ShippingZone, ShippingModality, SHIPPING_ZONES_INFO, SHIPPING_MODALITY_INFO } from '@/src/types';

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

export interface OlvaFormData {
    fullName: string;
    dni: string;
    phone: string;
    email: string;
    departamento: string;
    provincia: string;
    distrito: string;
    address: string;
    shippingModality: ShippingModality;
    shippingZone: ShippingZone;
}

interface OlvaShippingFormProps {
    onFormChange: (data: OlvaFormData, isValid: boolean) => void;
    onShippingZoneChange?: (zone: ShippingZone) => void;
}

// ═══════════════════════════════════════════════════════════════
// VALIDATION HELPERS
// ═══════════════════════════════════════════════════════════════

const validateDNI = (dni: string): boolean => {
    return /^\d{8}$/.test(dni);
};

const validatePhone = (phone: string): boolean => {
    return /^9\d{8}$/.test(phone);
};

const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// ═══════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════

export default function OlvaShippingForm({ onFormChange, onShippingZoneChange }: OlvaShippingFormProps) {
    // Form state
    const [fullName, setFullName] = useState('');
    const [dni, setDni] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [departamento, setDepartamento] = useState('');
    const [provincia, setProvincia] = useState('');
    const [distrito, setDistrito] = useState('');
    const [address, setAddress] = useState('');
    const [shippingModality, setShippingModality] = useState<ShippingModality>('DOMICILIO');

    // Touched state for validation display
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    // Location data
    const departamentos = useMemo(() => getDepartamentos(), []);
    const provincias = useMemo(() => getProvincias(departamento), [departamento]);
    const distritos = useMemo(() => getDistritos(departamento, provincia), [departamento, provincia]);

    // Auto-calculated shipping zone
    const shippingZone = useMemo(() => {
        return departamento ? getShippingZoneFromDepartamento(departamento) : 'LIMA_LOCAL';
    }, [departamento]);

    // Validation errors
    const errors = useMemo(() => ({
        fullName: !fullName.trim() ? 'El nombre es obligatorio' : '',
        dni: !dni ? 'El DNI es obligatorio' : !validateDNI(dni) ? 'El DNI debe tener 8 dígitos' : '',
        phone: !phone ? 'El celular es obligatorio' : !validatePhone(phone) ? 'El celular debe tener 9 dígitos y empezar con 9' : '',
        email: !email ? 'El correo es obligatorio' : !validateEmail(email) ? 'Ingresa un correo válido' : '',
        departamento: !departamento ? 'Selecciona un departamento' : '',
        provincia: !provincia ? 'Selecciona una provincia' : '',
        distrito: !distrito ? 'Selecciona un distrito' : '',
        address: !address.trim() ? 'La dirección es obligatoria' : '',
    }), [fullName, dni, phone, email, departamento, provincia, distrito, address]);

    // Check if form is valid
    const isFormValid = useMemo(() => {
        return Object.values(errors).every(error => !error);
    }, [errors]);

    // Reset provincia and distrito when departamento changes
    useEffect(() => {
        setProvincia('');
        setDistrito('');
    }, [departamento]);

    // Reset distrito when provincia changes
    useEffect(() => {
        setDistrito('');
    }, [provincia]);

    // Notify parent of changes
    useEffect(() => {
        const formData: OlvaFormData = {
            fullName,
            dni,
            phone,
            email,
            departamento,
            provincia,
            distrito,
            address,
            shippingModality,
            shippingZone,
        };
        onFormChange(formData, isFormValid);
    }, [fullName, dni, phone, email, departamento, provincia, distrito, address, shippingModality, shippingZone, isFormValid, onFormChange]);

    // Notify parent of shipping zone changes
    useEffect(() => {
        if (onShippingZoneChange && departamento) {
            onShippingZoneChange(shippingZone);
        }
    }, [shippingZone, departamento, onShippingZoneChange]);

    const handleBlur = (field: string) => {
        setTouched(prev => ({ ...prev, [field]: true }));
    };

    const showError = (field: keyof typeof errors) => {
        return touched[field] && errors[field];
    };

    return (
        <div className="bg-white rounded-2xl border-2 border-brand-cream-dark overflow-hidden">
            {/* Header with Olva Logo - Brown rounded container */}
            <div className="bg-brand-brown rounded-t-xl px-4 sm:px-6 py-4 flex items-center justify-between">
                <h2 className="font-baloo text-xl sm:text-2xl text-white font-bold">
                    Datos para tu envío
                </h2>
                <div className="flex-shrink-0">
                    <Image
                        src="/iconoOlva.png"
                        alt="Olva Courier"
                        width={100}
                        height={100}
                        className="object-contain h-4 sm:h-8 w-auto"
                    />
                </div>
            </div>

            <div className="p-4 sm:p-6 space-y-4">
                {/* Nombre Completo */}
                <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                        <User className="w-4 h-4 text-brand-brown" />
                        Nombre Completo *
                    </label>
                    <input
                        type="text"
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        onBlur={() => handleBlur('fullName')}
                        placeholder="Ingresa tu nombre completo"
                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all outline-none
              ${showError('fullName')
                                ? 'border-red-300 focus:border-red-400 bg-red-50'
                                : 'border-brand-cream-dark focus:border-brand-orange bg-white'
                            }`}
                    />
                    {showError('fullName') && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.fullName}
                        </p>
                    )}
                </div>

                {/* DNI y Celular en fila */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* DNI */}
                    <div>
                        <label htmlFor="dni" className="block text-sm font-medium text-gray-700 mb-1.5">
                            DNI *
                        </label>
                        <input
                            type="text"
                            id="dni"
                            value={dni}
                            onChange={(e) => setDni(e.target.value.replace(/\D/g, '').slice(0, 8))}
                            onBlur={() => handleBlur('dni')}
                            placeholder="12345678"
                            maxLength={8}
                            className={`w-full px-4 py-3 rounded-xl border-2 transition-all outline-none
                ${showError('dni')
                                    ? 'border-red-300 focus:border-red-400 bg-red-50'
                                    : 'border-brand-cream-dark focus:border-brand-orange bg-white'
                                }`}
                        />
                        {showError('dni') && (
                            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {errors.dni}
                            </p>
                        )}
                    </div>

                    {/* Celular */}
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                            <Phone className="w-4 h-4 text-brand-brown" />
                            Celular *
                        </label>
                        <input
                            type="text"
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 9))}
                            onBlur={() => handleBlur('phone')}
                            placeholder="987654321"
                            maxLength={9}
                            className={`w-full px-4 py-3 rounded-xl border-2 transition-all outline-none
                ${showError('phone')
                                    ? 'border-red-300 focus:border-red-400 bg-red-50'
                                    : 'border-brand-cream-dark focus:border-brand-orange bg-white'
                                }`}
                        />
                        {showError('phone') && (
                            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {errors.phone}
                            </p>
                        )}
                    </div>
                </div>

                {/* Email */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-brand-brown" />
                        Correo Electrónico *
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={() => handleBlur('email')}
                        placeholder="tucorreo@ejemplo.com"
                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all outline-none
              ${showError('email')
                                ? 'border-red-300 focus:border-red-400 bg-red-50'
                                : 'border-brand-cream-dark focus:border-brand-orange bg-white'
                            }`}
                    />
                    {showError('email') && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.email}
                        </p>
                    )}
                </div>

                {/* Ubicación - Selects en cascada */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <MapPin className="w-4 h-4 text-brand-brown" />
                        Ubicación de Envío
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {/* Departamento */}
                        <div>
                            <label htmlFor="departamento" className="block text-xs text-gray-500 mb-1">
                                Departamento *
                            </label>
                            <select
                                id="departamento"
                                value={departamento}
                                onChange={(e) => setDepartamento(e.target.value)}
                                onBlur={() => handleBlur('departamento')}
                                className={`w-full px-3 py-3 rounded-xl border-2 transition-all outline-none bg-white
                  ${showError('departamento')
                                        ? 'border-red-300 focus:border-red-400'
                                        : 'border-brand-cream-dark focus:border-brand-orange'
                                    }`}
                            >
                                <option value="">Seleccionar</option>
                                {departamentos.map((dept) => (
                                    <option key={dept} value={dept}>
                                        {dept.charAt(0) + dept.slice(1).toLowerCase()}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Provincia */}
                        <div>
                            <label htmlFor="provincia" className="block text-xs text-gray-500 mb-1">
                                Provincia *
                            </label>
                            <select
                                id="provincia"
                                value={provincia}
                                onChange={(e) => setProvincia(e.target.value)}
                                onBlur={() => handleBlur('provincia')}
                                disabled={!departamento}
                                className={`w-full px-3 py-3 rounded-xl border-2 transition-all outline-none bg-white
                  ${!departamento ? 'bg-gray-100 cursor-not-allowed' : ''}
                  ${showError('provincia')
                                        ? 'border-red-300 focus:border-red-400'
                                        : 'border-brand-cream-dark focus:border-brand-orange'
                                    }`}
                            >
                                <option value="">Seleccionar</option>
                                {provincias.map((prov) => (
                                    <option key={prov} value={prov}>
                                        {prov}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Distrito */}
                        <div>
                            <label htmlFor="distrito" className="block text-xs text-gray-500 mb-1">
                                Distrito *
                            </label>
                            <select
                                id="distrito"
                                value={distrito}
                                onChange={(e) => setDistrito(e.target.value)}
                                onBlur={() => handleBlur('distrito')}
                                disabled={!provincia}
                                className={`w-full px-3 py-3 rounded-xl border-2 transition-all outline-none bg-white
                  ${!provincia ? 'bg-gray-100 cursor-not-allowed' : ''}
                  ${showError('distrito')
                                        ? 'border-red-300 focus:border-red-400'
                                        : 'border-brand-cream-dark focus:border-brand-orange'
                                    }`}
                            >
                                <option value="">Seleccionar</option>
                                {distritos.map((dist) => (
                                    <option key={dist} value={dist}>
                                        {dist}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Zona de envío detectada */}
                    {departamento && (
                        <div className="bg-pastel-blue/30 rounded-xl px-4 py-2 text-sm">
                            <span className="text-gray-600">Zona de envío: </span>
                            <span className="font-medium text-brand-brown">
                                {SHIPPING_ZONES_INFO[shippingZone].label}
                            </span>
                            <span className="text-gray-500 text-xs ml-2">
                                ({SHIPPING_ZONES_INFO[shippingZone].examples})
                            </span>
                        </div>
                    )}
                </div>

                {/* Dirección de Entrega */}
                <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                        <Home className="w-4 h-4 text-brand-brown" />
                        Dirección de Entrega *
                    </label>
                    <input
                        type="text"
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        onBlur={() => handleBlur('address')}
                        placeholder="Av. Ejemplo 123, Urb. Las Flores"
                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all outline-none
              ${showError('address')
                                ? 'border-red-300 focus:border-red-400 bg-red-50'
                                : 'border-brand-cream-dark focus:border-brand-orange bg-white'
                            }`}
                    />
                    {showError('address') && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.address}
                        </p>
                    )}
                </div>

                {/* Modalidad de Envío - Toggle */}
                <div className="pt-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                        <Package className="w-4 h-4 text-brand-brown" />
                        Modalidad de Envío
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {/* Domicilio */}
                        <button
                            type="button"
                            onClick={() => setShippingModality('DOMICILIO')}
                            className={`relative p-4 rounded-xl border-2 transition-all text-left
                ${shippingModality === 'DOMICILIO'
                                    ? 'border-brand-orange bg-brand-orange/10'
                                    : 'border-brand-cream-dark hover:border-brand-orange/50 bg-white'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
                  ${shippingModality === 'DOMICILIO' ? 'border-brand-orange' : 'border-gray-300'}`}
                                >
                                    {shippingModality === 'DOMICILIO' && (
                                        <div className="w-3 h-3 rounded-full bg-brand-orange" />
                                    )}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 flex items-center gap-2">
                                        <span className="text-lg">{SHIPPING_MODALITY_INFO.DOMICILIO.icon}</span>
                                        Envío a Domicilio
                                    </p>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        Recibe en tu casa u oficina
                                    </p>
                                </div>
                            </div>
                        </button>

                        {/* Agencia */}
                        <button
                            type="button"
                            onClick={() => setShippingModality('AGENCIA')}
                            className={`relative p-4 rounded-xl border-2 transition-all text-left
                ${shippingModality === 'AGENCIA'
                                    ? 'border-brand-orange bg-brand-orange/10'
                                    : 'border-brand-cream-dark hover:border-brand-orange/50 bg-white'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
                  ${shippingModality === 'AGENCIA' ? 'border-brand-orange' : 'border-gray-300'}`}
                                >
                                    {shippingModality === 'AGENCIA' && (
                                        <div className="w-3 h-3 rounded-full bg-brand-orange" />
                                    )}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 flex items-center gap-2">
                                        <span className="text-lg">{SHIPPING_MODALITY_INFO.AGENCIA.icon}</span>
                                        Recojo en Oficina Olva
                                    </p>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        Ahorra en costo de envío
                                    </p>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Info box */}
                <div className="bg-brand-cream rounded-xl p-4 mt-4">
                    <p className="text-sm text-brand-brown">
                        <span className="font-medium">📦 Importante:</span> Coordinaremos el pago y envío por WhatsApp.
                        Los tiempos de entrega varían según tu ubicación.
                    </p>
                </div>
            </div>
        </div>
    );
}
