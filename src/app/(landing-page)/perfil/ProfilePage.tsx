'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    MapPin, Phone, IdCard, Save, CheckCircle, AlertCircle,
    ChevronDown, ChevronUp, Package, Star, Gift, Loader2, ExternalLink, User, LogOut, LayoutDashboard
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { getProvincias, getDistritos, getShippingZoneFromDepartamento, getDepartamentos } from '@/src/app/lib/data/peruLocations';
import { ShippingZone, ShippingModality, SHIPPING_ZONES_INFO, OrderStatus } from '@/src/types';

interface ProfilePageProps {
    user: {
        id?: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
        role?: string;
    };
}

interface ProfileFormData {
    name: string;
    dni: string;
    phone: string;
    department: string;
    province: string;
    district: string;
    address: string;
    reference: string;
    locationUrl: string;
    shippingModality: ShippingModality;
}

interface OrderItem {
    id: string;
    quantity: number;
    unitPrice: number;
    product: {
        id: string;
        name: string;
        images: string[];
        price: number;
    };
}

interface UserOrder {
    id: string;
    orderNumber: string;
    status: OrderStatus;
    totalAmount: number;
    createdAt: string;
    items: OrderItem[];
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
    PENDING_PAYMENT: { label: 'En Proceso', bg: 'bg-amber-100', text: 'text-amber-800' },
    PAID: { label: 'Pagado', bg: 'bg-emerald-100', text: 'text-emerald-800' },
    SHIPPED: { label: 'Enviado', bg: 'bg-blue-100', text: 'text-blue-800' },
};

export default function ProfilePage({ user }: ProfilePageProps) {
    const [formData, setFormData] = useState<ProfileFormData>({
        name: user.name || '',
        dni: '',
        phone: '',
        department: '',
        province: '',
        district: '',
        address: '',
        reference: '',
        locationUrl: '',
        shippingModality: 'DOMICILIO',
    });

    const [availableProvinces, setAvailableProvinces] = useState<string[]>([]);
    const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);
    const [shippingZone, setShippingZone] = useState<ShippingZone | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [purrPoints, setPurrPoints] = useState(0);
    const [orders, setOrders] = useState<UserOrder[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
    const [ordersOpen, setOrdersOpen] = useState(false);

    // Load existing profile data
    useEffect(() => {
        async function loadProfile() {
            try {
                const response = await fetch('/api/user/profile');
                if (response.ok) {
                    const data = await response.json();
                    if (data.profile) {
                        setFormData(prev => ({
                            ...prev,
                            name: data.profile.name || user.name || '',
                            dni: data.profile.dni || '',
                            phone: data.profile.phone || '',
                            department: data.profile.department || '',
                            province: data.profile.province || '',
                            district: data.profile.district || '',
                            address: data.profile.address || '',
                            reference: data.profile.reference || '',
                            locationUrl: data.profile.locationUrl || '',
                            shippingModality: data.profile.shippingModality || 'DOMICILIO',
                        }));
                        setPurrPoints(data.profile.purrPoints || 0);
                        if (data.profile.department) {
                            setAvailableProvinces(getProvincias(data.profile.department));
                            setShippingZone(getShippingZoneFromDepartamento(data.profile.department));
                        }
                        if (data.profile.province) {
                            setAvailableDistricts(getDistritos(data.profile.department, data.profile.province));
                        }
                    }
                }
            } catch (error) {
                console.error('Error loading profile:', error);
            } finally {
                setIsLoading(false);
            }
        }
        loadProfile();
    }, [user.name]);

    // Load orders
    useEffect(() => {
        async function loadOrders() {
            try {
                const response = await fetch('/api/user/orders');
                if (response.ok) {
                    const data = await response.json();
                    setOrders(data.orders || []);
                }
            } catch (error) {
                console.error('Error loading orders:', error);
            } finally {
                setLoadingOrders(false);
            }
        }
        loadOrders();
    }, []);

    // Update provinces when department changes
    const handleDepartmentChange = useCallback((department: string) => {
        setFormData(prev => ({
            ...prev,
            department,
            province: '',
            district: '',
        }));
        setAvailableProvinces(getProvincias(department));
        setAvailableDistricts([]);
        setShippingZone(getShippingZoneFromDepartamento(department));
    }, []);

    // Update districts when province changes
    const handleProvinceChange = useCallback((province: string) => {
        setFormData(prev => ({
            ...prev,
            province,
            district: '',
        }));
        setAvailableDistricts(getDistritos(formData.department, province));
    }, [formData.department]);

    // Validation
    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
        if (!formData.dni.match(/^\d{8}$/)) newErrors.dni = 'DNI debe tener 8 dígitos';
        if (!formData.phone.match(/^9\d{8}$/)) newErrors.phone = 'Teléfono debe ser 9 dígitos comenzando con 9';
        if (!formData.department) newErrors.department = 'Selecciona un departamento';
        if (!formData.province) newErrors.province = 'Selecciona una provincia';
        if (!formData.district) newErrors.district = 'Selecciona un distrito';
        if (!formData.address.trim()) newErrors.address = 'La dirección es requerida';
        if (formData.locationUrl.trim() && !/^https?:\/\/(www\.)?(google\.[a-z.]+\/maps|maps\.google\.[a-z.]+|goo\.gl\/maps|maps\.app\.goo\.gl)/i.test(formData.locationUrl.trim())) {
            newErrors.locationUrl = 'Ingresa un enlace válido de Google Maps';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Save profile
    const handleSave = async () => {
        if (!validateForm()) return;

        setIsSaving(true);
        setSaveMessage(null);

        try {
            const response = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    shippingZone,
                }),
            });

            if (response.ok) {
                setSaveMessage({ type: 'success', text: '¡Perfil guardado correctamente!' });
            } else {
                const data = await response.json();
                setSaveMessage({ type: 'error', text: data.error || 'Error al guardar' });
            }
        } catch (error) {
            console.error('Save error:', error);
            setSaveMessage({ type: 'error', text: 'Error de conexión' });
        } finally {
            setIsSaving(false);
        }
    };

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-brand-cream/30 pt-24 pb-24 flex items-center justify-center">
                <div className="flex items-center gap-3 text-brand-brown">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="font-nunito">Cargando perfil...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-cream/30 pb-32 lg:pb-16">


            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* TWO-COLUMN DESKTOP LAYOUT                                     */}
            {/* Mobile: stacked | Desktop: left sidebar + right form          */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <div className="max-w-6xl mx-auto px-4 pt-6 lg:pt-12">
                <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6 lg:gap-8">

                    {/* ============================================================= */}
                    {/* LEFT COLUMN: Profile Card + Purr Points + Orders              */}
                    {/* ============================================================= */}
                    <div className="space-y-6">

                        {/* USER HEADER */}
                        <div className="bg-white rounded-3xl shadow-soft p-6 text-center">
                            {/* Avatar */}
                            <div className="relative w-20 h-20 mx-auto mb-3">
                                {user.image ? (
                                    <img
                                        src={user.image}
                                        alt={user.name || 'Perfil'}
                                        className="w-20 h-20 rounded-full object-cover ring-4 ring-brand-orange/20"
                                    />
                                ) : (
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-orange to-pastel-orange flex items-center justify-center ring-4 ring-brand-orange/20">
                                        <span className="text-3xl">🐱</span>
                                    </div>
                                )}
                            </div>

                            <h1 className="font-baloo text-xl font-bold text-brand-brown">
                                {formData.name || user.name || 'Purrfect Glower'} ✨
                            </h1>
                            <p className="font-nunito text-brand-brown/60 text-xs mt-1">
                                {user.email}
                            </p>
                            <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 bg-pastel-green/40 rounded-full">
                                <Star size={12} className="text-green-600 fill-green-600" />
                                <span className="font-nunito text-xs font-semibold text-green-700">VIP Member</span>
                            </div>

                            {/* Account Actions */}
                            <div className="flex items-center justify-center gap-2 mt-4">
                                {user.role === 'ADMIN' && (
                                    <Link
                                        href="/dashboard"
                                        className="flex items-center gap-1.5 px-4 py-2 bg-pastel-purple/20 text-brand-brown rounded-full font-nunito text-xs font-semibold hover:bg-pastel-purple/30 transition-colors"
                                    >
                                        <LayoutDashboard size={14} />
                                        Dashboard
                                    </Link>
                                )}
                                <button
                                    onClick={() => signOut({ callbackUrl: '/' })}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-600 rounded-full font-nunito text-xs font-semibold hover:bg-red-100 transition-colors"
                                >
                                    <LogOut size={14} />
                                    Cerrar sesión
                                </button>
                            </div>
                        </div>

                        {/* PURR POINTS */}
                        <div className="bg-gradient-to-br from-pastel-green/60 to-pastel-blue/40 rounded-3xl shadow-soft p-5 text-center">
                            <p className="font-nunito text-xs font-medium text-brand-brown/70 uppercase tracking-wider">
                                Tus Puntos
                            </p>
                            <div className="flex items-center justify-center gap-2 my-2">
                                <span className="font-baloo text-4xl font-bold text-brand-brown">
                                    {purrPoints}
                                </span>
                                <span className="text-2xl">🐾</span>
                            </div>
                            <p className="font-nunito text-xs text-brand-brown/50 mb-3">
                                Acumulas S/ 1 = 1 punto
                            </p>
                            <button className="bg-brand-orange text-white px-5 py-2 rounded-full font-nunito font-semibold text-xs hover:bg-brand-orange/90 transition-colors shadow-soft flex items-center gap-1.5 mx-auto">
                                <Gift size={14} />
                                Canjear Beneficios
                            </button>
                        </div>

                        {/* MIS PEDIDOS - Collapsible Section */}
                        <div className="bg-white rounded-3xl shadow-soft p-5">
                            <button
                                onClick={() => setOrdersOpen(!ordersOpen)}
                                className="w-full flex items-center justify-between"
                            >
                                <h2 className="font-baloo text-base font-bold text-brand-brown flex items-center gap-2">
                                    <Package size={18} className="text-brand-orange" />
                                    Mis Pedidos
                                    <span className="font-nunito text-xs text-brand-orange font-medium">
                                        {orders.length > 0 ? `(${orders.length})` : '(0)'}
                                    </span>
                                </h2>
                                {ordersOpen ? (
                                    <ChevronUp size={18} className="text-brand-brown/40" />
                                ) : (
                                    <ChevronDown size={18} className="text-brand-brown/40" />
                                )}
                            </button>

                            {ordersOpen && (
                                <div className="mt-4">
                                    {loadingOrders ? (
                                        <div className="flex items-center justify-center py-6 text-brand-brown/50">
                                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                            <span className="font-nunito text-xs">Cargando...</span>
                                        </div>
                                    ) : orders.length === 0 ? (
                                        <div className="text-center py-6">
                                            <span className="text-3xl mb-2 block">📭</span>
                                            <p className="font-nunito text-brand-brown/50 text-xs">
                                                Aún no tienes pedidos
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {orders.map((order) => {
                                                const statusConf = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING_PAYMENT;
                                                const isExpanded = expandedOrderId === order.id;
                                                return (
                                                    <div key={order.id} className="border border-brand-cream-dark rounded-2xl overflow-hidden transition-shadow hover:shadow-soft">
                                                        {/* Compact row — always visible */}
                                                        <button
                                                            onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                                                            className="w-full flex items-center justify-between px-3 py-2.5 text-left"
                                                        >
                                                            <div className="flex items-center gap-2 min-w-0">
                                                                {/* First product thumbnail */}
                                                                <div className="w-8 h-8 rounded-lg bg-brand-cream overflow-hidden relative flex-shrink-0">
                                                                    {order.items[0]?.product.images[0] ? (
                                                                        <img
                                                                            src={order.items[0].product.images[0]}
                                                                            alt=""
                                                                            className="w-full h-full object-cover"
                                                                        />
                                                                    ) : (
                                                                        <div className="w-full h-full flex items-center justify-center text-xs">🧴</div>
                                                                    )}
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <p className="font-nunito text-xs font-semibold text-brand-brown truncate">
                                                                        #{order.id.slice(0, 8).toUpperCase()}
                                                                    </p>
                                                                    <p className="font-nunito text-[10px] text-brand-brown/40">
                                                                        {formatDate(order.createdAt)}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-nunito font-semibold ${statusConf.bg} ${statusConf.text}`}>
                                                                    {statusConf.label}
                                                                </span>
                                                                <span className="font-baloo text-xs font-bold text-brand-brown">
                                                                    S/{order.totalAmount.toFixed(2)}
                                                                </span>
                                                                {isExpanded ? (
                                                                    <ChevronUp size={14} className="text-brand-brown/40" />
                                                                ) : (
                                                                    <ChevronDown size={14} className="text-brand-brown/40" />
                                                                )}
                                                            </div>
                                                        </button>

                                                        {/* Expanded details */}
                                                        {isExpanded && (
                                                            <div className="px-3 pb-3 pt-1 border-t border-brand-cream-dark">
                                                                <div className="space-y-1.5">
                                                                    {order.items.map((item) => (
                                                                        <div key={item.id} className="flex items-center gap-2">
                                                                            <div className="w-7 h-7 rounded-lg bg-brand-cream overflow-hidden flex-shrink-0">
                                                                                {item.product.images[0] ? (
                                                                                    <img
                                                                                        src={item.product.images[0]}
                                                                                        alt={item.product.name}
                                                                                        className="w-full h-full object-cover"
                                                                                    />
                                                                                ) : (
                                                                                    <div className="w-full h-full flex items-center justify-center text-[10px]">🧴</div>
                                                                                )}
                                                                            </div>
                                                                            <span className="font-nunito text-xs text-brand-brown truncate flex-1">
                                                                                {item.product.name}
                                                                            </span>
                                                                            <span className="font-nunito text-[10px] text-brand-brown/50">
                                                                                x{item.quantity}
                                                                            </span>
                                                                            <span className="font-nunito text-xs font-medium text-brand-brown">
                                                                                S/{item.unitPrice.toFixed(2)}
                                                                            </span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ============================================================= */}
                    {/* RIGHT COLUMN: Form (Mi Dirección y Datos)                     */}
                    {/* ============================================================= */}
                    <div
                        className="bg-white rounded-3xl shadow-soft p-6 h-fit lg:sticky lg:top-24"
                    >
                        <h2 className="font-baloo text-lg font-bold text-brand-brown flex items-center gap-2 mb-6">
                            <MapPin size={20} className="text-brand-orange" />
                            Mi Dirección y Datos
                        </h2>

                        <div className="space-y-4">
                            {/* Nombre y Apellidos */}
                            <div>
                                <label className="block text-xs font-nunito text-brand-brown/60 mb-1 uppercase tracking-wider">
                                    Nombre y Apellidos
                                </label>
                                <div className="relative">
                                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-brown/30" />
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                        placeholder="Juan Pérez García"
                                        className={`w-full pl-10 pr-3 py-3 bg-brand-cream rounded-2xl font-nunito text-brand-brown text-sm placeholder:text-brand-brown/30 focus:ring-2 focus:ring-brand-orange border-0 ${errors.name ? 'ring-2 ring-red-300' : ''}`}
                                    />
                                </div>
                                {errors.name && <p className="text-red-500 text-xs mt-1 font-nunito">{errors.name}</p>}
                            </div>

                            {/* DNI + Phone */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-nunito text-brand-brown/60 mb-1 uppercase tracking-wider">
                                        DNI
                                    </label>
                                    <div className="relative">
                                        <IdCard size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-brown/30" />
                                        <input
                                            type="text"
                                            maxLength={8}
                                            value={formData.dni}
                                            onChange={(e) => setFormData(prev => ({ ...prev, dni: e.target.value.replace(/\D/g, '') }))}
                                            placeholder="72849102"
                                            className={`w-full pl-10 pr-3 py-3 bg-brand-cream rounded-2xl font-nunito text-brand-brown text-sm placeholder:text-brand-brown/30 focus:ring-2 focus:ring-brand-orange border-0 ${errors.dni ? 'ring-2 ring-red-300' : ''}`}
                                        />
                                    </div>
                                    {errors.dni && <p className="text-red-500 text-xs mt-1 font-nunito">{errors.dni}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-nunito text-brand-brown/60 mb-1 uppercase tracking-wider">
                                        Celular
                                    </label>
                                    <div className="relative">
                                        <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-brown/30" />
                                        <input
                                            type="text"
                                            maxLength={9}
                                            value={formData.phone}
                                            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value.replace(/\D/g, '') }))}
                                            placeholder="987 654 321"
                                            className={`w-full pl-10 pr-3 py-3 bg-brand-cream rounded-2xl font-nunito text-brand-brown text-sm placeholder:text-brand-brown/30 focus:ring-2 focus:ring-brand-orange border-0 ${errors.phone ? 'ring-2 ring-red-300' : ''}`}
                                        />
                                    </div>
                                    {errors.phone && <p className="text-red-500 text-xs mt-1 font-nunito">{errors.phone}</p>}
                                </div>
                            </div>

                            {/* Department */}
                            <div>
                                <label className="block text-xs font-nunito text-brand-brown/60 mb-1 uppercase tracking-wider">
                                    Departamento
                                </label>
                                <div className="relative">
                                    <select
                                        value={formData.department}
                                        onChange={(e) => handleDepartmentChange(e.target.value)}
                                        className={`w-full px-4 py-3 bg-brand-cream rounded-2xl font-nunito text-brand-brown text-sm focus:ring-2 focus:ring-brand-orange border-0 appearance-none ${errors.department ? 'ring-2 ring-red-300' : ''}`}
                                    >
                                        <option value="">Seleccionar</option>
                                        {getDepartamentos().map(dept => (
                                            <option key={dept} value={dept}>{dept}</option>
                                        ))}
                                    </select>
                                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-brown/40 pointer-events-none" />
                                </div>
                                {errors.department && <p className="text-red-500 text-xs mt-1 font-nunito">{errors.department}</p>}

                                {/* Shipping Zone Badge */}
                                {shippingZone && (
                                    <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-pastel-blue/30 rounded-full">
                                        <span className="text-xs">📍</span>
                                        <span className="font-nunito text-xs text-brand-brown/70">
                                            Zona: {SHIPPING_ZONES_INFO[shippingZone]?.label || shippingZone}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Province + District */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-nunito text-brand-brown/60 mb-1 uppercase tracking-wider">
                                        Provincia
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={formData.province}
                                            onChange={(e) => handleProvinceChange(e.target.value)}
                                            disabled={!formData.department}
                                            className={`w-full px-4 py-3 bg-brand-cream rounded-2xl font-nunito text-brand-brown text-sm focus:ring-2 focus:ring-brand-orange border-0 appearance-none disabled:opacity-50 ${errors.province ? 'ring-2 ring-red-300' : ''}`}
                                        >
                                            <option value="">Seleccionar</option>
                                            {availableProvinces.map(p => (
                                                <option key={p} value={p}>{p}</option>
                                            ))}
                                        </select>
                                        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-brown/40 pointer-events-none" />
                                    </div>
                                    {errors.province && <p className="text-red-500 text-xs mt-1 font-nunito">{errors.province}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-nunito text-brand-brown/60 mb-1 uppercase tracking-wider">
                                        Distrito
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={formData.district}
                                            onChange={(e) => setFormData(prev => ({ ...prev, district: e.target.value }))}
                                            disabled={!formData.province}
                                            className={`w-full px-4 py-3 bg-brand-cream rounded-2xl font-nunito text-brand-brown text-sm focus:ring-2 focus:ring-brand-orange border-0 appearance-none disabled:opacity-50 ${errors.district ? 'ring-2 ring-red-300' : ''}`}
                                        >
                                            <option value="">Seleccionar</option>
                                            {availableDistricts.map(d => (
                                                <option key={d} value={d}>{d}</option>
                                            ))}
                                        </select>
                                        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-brown/40 pointer-events-none" />
                                    </div>
                                    {errors.district && <p className="text-red-500 text-xs mt-1 font-nunito">{errors.district}</p>}
                                </div>
                            </div>

                            {/* Address */}
                            <div>
                                <label className="block text-xs font-nunito text-brand-brown/60 mb-1 uppercase tracking-wider">
                                    Dirección
                                </label>
                                <input
                                    type="text"
                                    value={formData.address}
                                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                                    placeholder="Av. Larco 123, Dpto 401"
                                    className={`w-full px-4 py-3 bg-brand-cream rounded-2xl font-nunito text-brand-brown text-sm placeholder:text-brand-brown/30 focus:ring-2 focus:ring-brand-orange border-0 ${errors.address ? 'ring-2 ring-red-300' : ''}`}
                                />
                                {errors.address && <p className="text-red-500 text-xs mt-1 font-nunito">{errors.address}</p>}
                            </div>

                            {/* Reference (optional) */}
                            <div>
                                <label className="block text-xs font-nunito text-brand-brown/60 mb-1 uppercase tracking-wider">
                                    Referencia (opcional)
                                </label>
                                <input
                                    type="text"
                                    value={formData.reference}
                                    onChange={(e) => setFormData(prev => ({ ...prev, reference: e.target.value }))}
                                    placeholder="Frente al parque Kennedy"
                                    className="w-full px-4 py-3 bg-brand-cream rounded-2xl font-nunito text-brand-brown text-sm placeholder:text-brand-brown/30 focus:ring-2 focus:ring-brand-orange border-0"
                                />
                            </div>

                            {/* Google Maps Location URL (optional) */}
                            <div>
                                <label className="block text-xs font-nunito text-brand-brown/60 mb-1 uppercase tracking-wider">
                                    Ubicación Google Maps (opcional)
                                </label>
                                <div className="relative">
                                    <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-brown/30" />
                                    <input
                                        type="url"
                                        value={formData.locationUrl}
                                        onChange={(e) => setFormData(prev => ({ ...prev, locationUrl: e.target.value }))}
                                        placeholder="https://maps.google.com/..."
                                        className={`w-full pl-10 pr-3 py-3 bg-brand-cream rounded-2xl font-nunito text-brand-brown text-sm placeholder:text-brand-brown/30 focus:ring-2 focus:ring-brand-orange border-0 ${errors.locationUrl ? 'ring-2 ring-red-300' : ''}`}
                                    />
                                </div>
                                {errors.locationUrl && <p className="text-red-500 text-xs mt-1 font-nunito">{errors.locationUrl}</p>}
                                <p className="text-xs font-nunito text-brand-brown/40 mt-1.5 flex items-center gap-1">
                                    📍 Abre Google Maps, busca tu dirección y pega el enlace aquí
                                </p>
                                {formData.locationUrl && !errors.locationUrl && (
                                    <a
                                        href={formData.locationUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 mt-1.5 text-brand-orange text-xs font-nunito font-semibold hover:text-brand-orange/80 transition"
                                    >
                                        <ExternalLink size={12} />
                                        Ver en Google Maps
                                    </a>
                                )}
                            </div>

                            {/* Save Message */}
                            {saveMessage && (
                                <div
                                    className={`flex items-center gap-2 p-3 rounded-2xl text-sm font-nunito ${saveMessage.type === 'success'
                                        ? 'bg-pastel-green/30 text-green-700'
                                        : 'bg-red-50 text-red-600'
                                        }`}
                                >
                                    {saveMessage.type === 'success' ? (
                                        <CheckCircle size={18} />
                                    ) : (
                                        <AlertCircle size={18} />
                                    )}
                                    {saveMessage.text}
                                </div>
                            )}

                            {/* Save Button */}
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="w-full py-3.5 bg-brand-orange text-white rounded-2xl font-nunito font-semibold text-sm hover:bg-brand-orange/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-soft"
                            >
                                {isSaving ? (
                                    <Loader2 size={18} className="animate-spin" />
                                ) : (
                                    <Save size={18} />
                                )}
                                Actualizar Datos 🐾
                            </button>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
