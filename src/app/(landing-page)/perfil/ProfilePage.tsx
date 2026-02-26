'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { User, MapPin, Phone, IdCard, Save, CheckCircle, AlertCircle, ChevronDown } from 'lucide-react';
import { PERU_LOCATIONS, getProvincias, getDistritos, getShippingZoneFromDepartamento, getDepartamentos } from '@/src/app/lib/data/peruLocations';
import { ShippingZone, ShippingModality, SHIPPING_ZONES_INFO } from '@/src/types';

interface ProfilePageProps {
    user: {
        id?: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
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
    shippingModality: ShippingModality;
}

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
        shippingModality: 'DOMICILIO',
    });

    const [availableProvinces, setAvailableProvinces] = useState<string[]>([]);
    const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);
    const [shippingZone, setShippingZone] = useState<ShippingZone | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});

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
                            shippingModality: data.profile.shippingModality || 'DOMICILIO',
                        }));
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

    if (isLoading) {
        return (
            <div className="min-h-screen bg-brand-cream/30 pt-24 pb-24 flex items-center justify-center">
                <div className="animate-pulse text-brand-brown">Cargando perfil...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-cream/30 pt-24 pb-24 lg:pt-28">
            <div className="max-w-2xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl shadow-soft p-6 lg:p-8"
                >
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-brand-orange to-pastel-orange flex items-center justify-center">
                            <User size={40} className="text-white" />
                        </div>
                        <h1 className="font-baloo text-2xl font-bold text-brand-brown">Mi Perfil</h1>
                        <p className="font-nunito text-brand-brown/60 text-sm mt-1">
                            Completa tus datos para agilizar tus compras
                        </p>
                    </div>

                    {/* Form */}
                    <div className="space-y-6">
                        {/* Personal Info Section */}
                        <div className="space-y-4">
                            <h2 className="font-baloo text-lg font-semibold text-brand-brown flex items-center gap-2">
                                <IdCard size={20} className="text-brand-orange" />
                                Datos Personales
                            </h2>

                            {/* Name */}
                            <div>
                                <label className="block text-sm font-nunito text-brand-brown mb-1">
                                    Nombre Completo *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    className={`w-full px-4 py-3 rounded-xl border ${errors.name ? 'border-red-400' : 'border-brand-cream'} focus:ring-2 focus:ring-brand-orange focus:border-transparent font-nunito`}
                                    placeholder="Tu nombre completo"
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>

                            {/* DNI and Phone */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-nunito text-brand-brown mb-1">
                                        DNI *
                                    </label>
                                    <input
                                        type="text"
                                        maxLength={8}
                                        value={formData.dni}
                                        onChange={(e) => setFormData(prev => ({ ...prev, dni: e.target.value.replace(/\D/g, '') }))}
                                        className={`w-full px-4 py-3 rounded-xl border ${errors.dni ? 'border-red-400' : 'border-brand-cream'} focus:ring-2 focus:ring-brand-orange focus:border-transparent font-nunito`}
                                        placeholder="12345678"
                                    />
                                    {errors.dni && <p className="text-red-500 text-xs mt-1">{errors.dni}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-nunito text-brand-brown mb-1">
                                        Teléfono *
                                    </label>
                                    <input
                                        type="tel"
                                        maxLength={9}
                                        value={formData.phone}
                                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value.replace(/\D/g, '') }))}
                                        className={`w-full px-4 py-3 rounded-xl border ${errors.phone ? 'border-red-400' : 'border-brand-cream'} focus:ring-2 focus:ring-brand-orange focus:border-transparent font-nunito`}
                                        placeholder="987654321"
                                    />
                                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Shipping Address Section */}
                        <div className="space-y-4">
                            <h2 className="font-baloo text-lg font-semibold text-brand-brown flex items-center gap-2">
                                <MapPin size={20} className="text-brand-orange" />
                                Dirección de Envío
                            </h2>

                            {/* Department, Province, District */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Department */}
                                <div className="relative">
                                    <label className="block text-sm font-nunito text-brand-brown mb-1">
                                        Departamento *
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={formData.department}
                                            onChange={(e) => handleDepartmentChange(e.target.value)}
                                            className={`w-full px-4 py-3 rounded-xl border ${errors.department ? 'border-red-400' : 'border-brand-cream'} focus:ring-2 focus:ring-brand-orange focus:border-transparent font-nunito appearance-none bg-white pr-10`}
                                        >
                                            <option value="">Seleccionar</option>
                                            {getDepartamentos().map((dept) => (
                                                <option key={dept} value={dept}>{dept}</option>
                                            ))}
                                        </select>
                                        <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-brown/40 pointer-events-none" />
                                    </div>
                                    {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
                                </div>

                                {/* Province */}
                                <div className="relative">
                                    <label className="block text-sm font-nunito text-brand-brown mb-1">
                                        Provincia *
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={formData.province}
                                            onChange={(e) => handleProvinceChange(e.target.value)}
                                            disabled={!formData.department}
                                            className={`w-full px-4 py-3 rounded-xl border ${errors.province ? 'border-red-400' : 'border-brand-cream'} focus:ring-2 focus:ring-brand-orange focus:border-transparent font-nunito appearance-none bg-white pr-10 disabled:opacity-50`}
                                        >
                                            <option value="">Seleccionar</option>
                                            {availableProvinces.map((prov) => (
                                                <option key={prov} value={prov}>{prov}</option>
                                            ))}
                                        </select>
                                        <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-brown/40 pointer-events-none" />
                                    </div>
                                    {errors.province && <p className="text-red-500 text-xs mt-1">{errors.province}</p>}
                                </div>

                                {/* District */}
                                <div className="relative">
                                    <label className="block text-sm font-nunito text-brand-brown mb-1">
                                        Distrito *
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={formData.district}
                                            onChange={(e) => setFormData(prev => ({ ...prev, district: e.target.value }))}
                                            disabled={!formData.province}
                                            className={`w-full px-4 py-3 rounded-xl border ${errors.district ? 'border-red-400' : 'border-brand-cream'} focus:ring-2 focus:ring-brand-orange focus:border-transparent font-nunito appearance-none bg-white pr-10 disabled:opacity-50`}
                                        >
                                            <option value="">Seleccionar</option>
                                            {availableDistricts.map((dist) => (
                                                <option key={dist} value={dist}>{dist}</option>
                                            ))}
                                        </select>
                                        <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-brown/40 pointer-events-none" />
                                    </div>
                                    {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district}</p>}
                                </div>
                            </div>

                            {/* Shipping Zone Badge */}
                            {shippingZone && (
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="font-nunito text-brand-brown/60">Zona de envío:</span>
                                    <span className={`px-3 py-1 rounded-full font-nunito font-medium ${shippingZone === 'LIMA_LOCAL' ? 'bg-pastel-green text-green-700' :
                                        shippingZone === 'COSTA_NACIONAL' ? 'bg-pastel-blue text-blue-700' :
                                            'bg-pastel-purple text-purple-700'
                                        }`}>
                                        {SHIPPING_ZONES_INFO[shippingZone]?.label || shippingZone}
                                    </span>
                                </div>
                            )}

                            {/* Address */}
                            <div>
                                <label className="block text-sm font-nunito text-brand-brown mb-1">
                                    Dirección Completa *
                                </label>
                                <input
                                    type="text"
                                    value={formData.address}
                                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                                    className={`w-full px-4 py-3 rounded-xl border ${errors.address ? 'border-red-400' : 'border-brand-cream'} focus:ring-2 focus:ring-brand-orange focus:border-transparent font-nunito`}
                                    placeholder="Av. Principal 123, Dpto. 401"
                                />
                                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                            </div>

                            {/* Reference */}
                            <div>
                                <label className="block text-sm font-nunito text-brand-brown mb-1">
                                    Referencia
                                </label>
                                <input
                                    type="text"
                                    value={formData.reference}
                                    onChange={(e) => setFormData(prev => ({ ...prev, reference: e.target.value }))}
                                    className="w-full px-4 py-3 rounded-xl border border-brand-cream focus:ring-2 focus:ring-brand-orange focus:border-transparent font-nunito"
                                    placeholder="Frente al parque, cerca a la bodega..."
                                />
                            </div>

                            {/* Shipping Modality */}
                            <div>
                                <label className="block text-sm font-nunito text-brand-brown mb-2">
                                    Modalidad de Envío
                                </label>
                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, shippingModality: 'DOMICILIO' }))}
                                        className={`flex-1 py-3 px-4 rounded-xl border-2 font-nunito text-sm transition-all ${formData.shippingModality === 'DOMICILIO'
                                            ? 'border-brand-orange bg-brand-orange/10 text-brand-orange'
                                            : 'border-brand-cream text-brand-brown hover:border-brand-orange/50'
                                            }`}
                                    >
                                        🏠 Delivery a Domicilio
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, shippingModality: 'AGENCIA' }))}
                                        className={`flex-1 py-3 px-4 rounded-xl border-2 font-nunito text-sm transition-all ${formData.shippingModality === 'AGENCIA'
                                            ? 'border-brand-orange bg-brand-orange/10 text-brand-orange'
                                            : 'border-brand-cream text-brand-brown hover:border-brand-orange/50'
                                            }`}
                                    >
                                        📦 Recojo en Agencia
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Save Message */}
                        {saveMessage && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex items-center gap-2 p-4 rounded-xl ${saveMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                                    }`}
                            >
                                {saveMessage.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                                <span className="font-nunito">{saveMessage.text}</span>
                            </motion.div>
                        )}

                        {/* Save Button */}
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-orange to-pastel-orange text-white font-baloo font-bold text-lg hover:shadow-glow transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isSaving ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <Save size={20} />
                                    Guardar Perfil
                                </>
                            )}
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
