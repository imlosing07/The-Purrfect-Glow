'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
    X,
    Plus,
    Upload,
    Sparkles,
    ArrowRight,
    Save,
    Loader2,
    ImagePlus,
    Link as LinkIcon,
    Tag
} from 'lucide-react';
import { UsageTime, RoutineStep, ROUTINE_STEP_INFO, Product, Tag as TagType, TagType as TagTypeEnum } from '@/src/types';
import { useToast } from './Toast';

// Tag type labels and colors
const TAG_TYPE_CONFIG: Record<TagTypeEnum, { label: string; color: string }> = {
    [TagTypeEnum.SKIN_TYPE]: { label: '🧴 Tipo de Piel', color: 'bg-pastel-blue text-blue-800' },
    [TagTypeEnum.CONCERN]: { label: '💆 Preocupación', color: 'bg-pastel-purple text-purple-800' },
    [TagTypeEnum.CATEGORY]: { label: '📦 Categoría', color: 'bg-pastel-green text-green-800' },
};

// ═══════════════════════════════════════════════════════════════
// ZOD SCHEMA
// ═══════════════════════════════════════════════════════════════

const productSchema = z.object({
    name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
    price: z.number().min(1, 'El precio debe ser mayor a 0'),
    summary: z.string().min(10, 'El resumen debe tener al menos 10 caracteres'),
    howToUse: z.string().optional(),
    routineStep: z.nativeEnum(RoutineStep).optional().nullable(),
    usageTime: z.nativeEnum(UsageTime),
    isAvailable: z.boolean(),
    featured: z.boolean(),
});

type ProductFormData = z.infer<typeof productSchema>;

// Imagen pendiente de subir
interface PendingImage {
    id: string;
    type: 'file' | 'url';
    preview: string;
    file?: File;
    url?: string;
    uploaded: boolean;
    uploading: boolean;
    cloudinaryUrl?: string;
}

// ═══════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════

interface ProductFormProps {
    product?: Product;
    mode: 'create' | 'edit';
}

export default function ProductForm({ product, mode }: ProductFormProps) {
    const router = useRouter();
    const { showToast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imageInputMode, setImageInputMode] = useState<'file' | 'url'>('file');

    // Imágenes ya subidas a Cloudinary (para edición)
    const [existingImages, setExistingImages] = useState<string[]>(product?.images || []);

    // Imágenes pendientes de subir
    const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);

    // Complex fields state
    const [benefits, setBenefits] = useState<string[]>(product?.benefits || []);
    const [newBenefit, setNewBenefit] = useState('');
    const [keyIngredients, setKeyIngredients] = useState<Record<string, string>>(
        (product?.keyIngredients as Record<string, string>) || {}
    );
    const [newIngredientKey, setNewIngredientKey] = useState('');
    const [newIngredientValue, setNewIngredientValue] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    // Tags state
    const [availableTags, setAvailableTags] = useState<TagType[]>([]);
    const [selectedTagIds, setSelectedTagIds] = useState<string[]>(
        product?.tags?.map(t => t.id) || []
    );
    const [loadingTags, setLoadingTags] = useState(true);

    // Fetch tags on mount
    useEffect(() => {
        async function fetchTags() {
            try {
                const response = await fetch('/api/tags');
                if (response.ok) {
                    const data = await response.json();
                    setAvailableTags(data);
                }
            } catch (error) {
                console.error('Error fetching tags:', error);
            } finally {
                setLoadingTags(false);
            }
        }
        fetchTags();
    }, []);

    // Toggle tag selection
    const toggleTag = (tagId: string) => {
        if (mode === 'edit') return; // No editar tags en modo edit
        setSelectedTagIds(prev =>
            prev.includes(tagId)
                ? prev.filter(id => id !== tagId)
                : [...prev, tagId]
        );
    };

    // Group tags by type
    const groupedTags = availableTags.reduce((acc, tag) => {
        if (!acc[tag.type]) acc[tag.type] = [];
        acc[tag.type].push(tag);
        return acc;
    }, {} as Record<TagTypeEnum, TagType[]>);

    // React Hook Form
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch
    } = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: product?.name || '',
            price: product?.price || 0,
            summary: product?.summary || '',
            howToUse: product?.howToUse || '',
            routineStep: product?.routineStep || null,
            usageTime: product?.usageTime || UsageTime.BOTH,
            isAvailable: product?.isAvailable ?? true,
            featured: product?.featured ?? false,
        }
    });

    const productName = watch('name');

    // ═══════════════════════════════════════════════════════════════
    // IMAGE HANDLERS
    // ═══════════════════════════════════════════════════════════════

    // Agregar imagen desde archivo
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onload = () => {
                const newImage: PendingImage = {
                    id: `${Date.now()}-${Math.random()}`,
                    type: 'file',
                    preview: reader.result as string,
                    file,
                    uploaded: false,
                    uploading: false,
                };
                setPendingImages(prev => [...prev, newImage]);
            };
            reader.readAsDataURL(file);
        });

        // Limpiar input
        e.target.value = '';
    };

    // Agregar imagen desde URL
    const addImageFromUrl = () => {
        if (!imageUrl.trim()) return;

        const newImage: PendingImage = {
            id: `${Date.now()}-${Math.random()}`,
            type: 'url',
            preview: imageUrl.trim(),
            url: imageUrl.trim(),
            uploaded: false,
            uploading: false,
        };
        setPendingImages(prev => [...prev, newImage]);
        setImageUrl('');
    };

    // Eliminar imagen pendiente
    const removePendingImage = (id: string) => {
        setPendingImages(prev => prev.filter(img => img.id !== id));
    };

    // Eliminar imagen existente
    const removeExistingImage = (index: number) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    };

    // Subir imagen a Cloudinary
    const uploadImageToCloudinary = async (image: PendingImage): Promise<string | null> => {
        try {
            if (image.type === 'file' && image.file) {
                const formData = new FormData();
                formData.append('file', image.file);
                formData.append('productName', productName || 'producto');
                formData.append('applyTransformations', 'true');

                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) throw new Error('Upload failed');
                const result = await response.json();
                return result.url;
            } else if (image.type === 'url' && image.url) {
                const response = await fetch('/api/upload', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        imageUrl: image.url,
                        productName: productName || 'producto',
                        applyTransformations: true,
                    }),
                });

                if (!response.ok) throw new Error('Upload failed');
                const result = await response.json();
                return result.url;
            }
            return null;
        } catch (error) {
            console.error('Error uploading image:', error);
            return null;
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // OTHER HANDLERS
    // ═══════════════════════════════════════════════════════════════

    const addBenefit = () => {
        if (newBenefit.trim() && !benefits.includes(newBenefit.trim())) {
            setBenefits([...benefits, newBenefit.trim()]);
            setNewBenefit('');
        }
    };

    const removeBenefit = (index: number) => {
        setBenefits(benefits.filter((_, i) => i !== index));
    };

    const addIngredient = () => {
        if (newIngredientKey.trim() && newIngredientValue.trim()) {
            setKeyIngredients({
                ...keyIngredients,
                [newIngredientKey.trim()]: newIngredientValue.trim()
            });
            setNewIngredientKey('');
            setNewIngredientValue('');
        }
    };

    const removeIngredient = (key: string) => {
        const { [key]: removed, ...rest } = keyIngredients;
        setKeyIngredients(rest);
    };

    // ═══════════════════════════════════════════════════════════════
    // SUBMIT
    // ═══════════════════════════════════════════════════════════════

    const onSubmit = async (data: ProductFormData) => {
        const totalImages = existingImages.length + pendingImages.length;
        if (totalImages === 0) {
            showToast('Agrega al menos una imagen', 'error');
            return;
        }

        setIsSubmitting(true);

        try {
            // 1. Subir imágenes pendientes a Cloudinary
            showToast('Subiendo imágenes a Cloudinary... 📸', 'info');

            const uploadedUrls: string[] = [];
            for (const image of pendingImages) {
                const cloudinaryUrl = await uploadImageToCloudinary(image);
                if (cloudinaryUrl) {
                    uploadedUrls.push(cloudinaryUrl);
                }
            }

            // 2. Combinar con imágenes existentes
            const allImages = [...existingImages, ...uploadedUrls];

            if (allImages.length === 0) {
                showToast('Error al subir imágenes', 'error');
                setIsSubmitting(false);
                return;
            }

            // 3. Crear payload - solo incluir tagIds en modo create
            const payload: Record<string, unknown> = {
                ...data,
                images: allImages,
                benefits,
                keyIngredients,
            };

            // Solo en modo create se envían los tags seleccionados
            // En modo edit NO se envía tagIds para preservar los tags existentes
            if (mode === 'create') {
                payload.tagIds = selectedTagIds;
            }

            // 4. Enviar al API
            const url = mode === 'create'
                ? '/api/products'
                : `/api/products/${product?.id}`;

            const method = mode === 'create' ? 'POST' : 'PATCH';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error('Failed to save product');

            showToast(
                mode === 'create'
                    ? '¡Producto creado! 🎉'
                    : '¡Cambios guardados! ✨'
            );

            router.push('/dashboard/inventario');
            router.refresh();
        } catch (error) {
            console.error('Error saving product:', error);
            showToast('Error al guardar producto', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // RENDER
    // ═══════════════════════════════════════════════════════════════

    const allPreviewImages = [
        ...existingImages.map((url, i) => ({ id: `existing-${i}`, preview: url, isExisting: true, index: i })),
        ...pendingImages.map(img => ({ id: img.id, preview: img.preview, isExisting: false, pendingImage: img, index: undefined })),
    ];

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="font-baloo font-bold text-3xl text-brand-brown">
                        {mode === 'create' ? 'Nuevo Producto ✨' : 'Editar Producto ✏️'}
                    </h1>
                    <p className="font-nunito text-brand-brown/70">
                        {mode === 'create'
                            ? 'Agrega un nuevo producto al catálogo'
                            : `Editando: ${product?.name}`
                        }
                    </p>
                </div>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-6 py-3 bg-brand-orange text-white font-nunito font-semibold rounded-2xl hover:bg-brand-brown transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-soft"
                >
                    {isSubmitting ? (
                        <Loader2 size={20} className="animate-spin" />
                    ) : (
                        <Save size={20} />
                    )}
                    {mode === 'create' ? 'Crear Producto' : 'Guardar Cambios'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Basic Info */}
                <div className="space-y-6">
                    {/* Name */}
                    <div className="bg-white rounded-3xl p-6 shadow-soft">
                        <label className="block font-nunito font-semibold text-brand-brown mb-2">
                            Nombre del Producto *
                        </label>
                        <input
                            {...register('name')}
                            placeholder="Ej: Beauty of Joseon - Protector Solar"
                            className="w-full px-4 py-3 bg-brand-cream rounded-2xl border-0 font-nunito text-brand-brown placeholder:text-brand-brown/40 focus:ring-2 focus:ring-brand-orange"
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-2 font-nunito">{errors.name.message}</p>
                        )}
                    </div>

                    {/* Price & Availability */}
                    <div className="bg-white rounded-3xl p-6 shadow-soft">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block font-nunito font-semibold text-brand-brown mb-2">
                                    Precio (S/) *
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    {...register('price', { valueAsNumber: true })}
                                    placeholder="85.00"
                                    className="w-full px-4 py-3 bg-brand-cream rounded-2xl border-0 font-nunito text-brand-brown focus:ring-2 focus:ring-brand-orange"
                                />
                                {errors.price && (
                                    <p className="text-red-500 text-sm mt-2 font-nunito">{errors.price.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block font-nunito font-semibold text-brand-brown mb-2">
                                    Momento de Uso
                                </label>
                                <select
                                    {...register('usageTime')}
                                    className="w-full px-4 py-3 bg-brand-cream rounded-2xl border-0 font-nunito text-brand-brown focus:ring-2 focus:ring-brand-orange"
                                >
                                    <option value={UsageTime.AM}>🌅 Mañana</option>
                                    <option value={UsageTime.PM}>🌙 Noche</option>
                                    <option value={UsageTime.BOTH}>☀️ Ambos</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-4 mt-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    {...register('isAvailable')}
                                    className="w-5 h-5 rounded-lg border-brand-cream text-pastel-green focus:ring-pastel-green"
                                />
                                <span className="font-nunito text-sm text-brand-brown">Disponible</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    {...register('featured')}
                                    className="w-5 h-5 rounded-lg border-brand-cream text-brand-orange focus:ring-brand-orange"
                                />
                                <span className="font-nunito text-sm text-brand-brown">⭐ Destacado</span>
                            </label>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="bg-white rounded-3xl p-6 shadow-soft">
                        <label className="block font-nunito font-semibold text-brand-brown mb-2">
                            Resumen *
                        </label>
                        <textarea
                            {...register('summary')}
                            rows={4}
                            placeholder="Describe brevemente el producto..."
                            className="w-full px-4 py-3 bg-brand-cream rounded-2xl border-0 font-nunito text-brand-brown placeholder:text-brand-brown/40 focus:ring-2 focus:ring-brand-orange resize-none"
                        />
                        {errors.summary && (
                            <p className="text-red-500 text-sm mt-2 font-nunito">{errors.summary.message}</p>
                        )}
                    </div>

                    {/* Routine Step & How to Use */}
                    <div className="bg-white rounded-3xl p-6 shadow-soft space-y-4">
                        <div>
                            <label className="block font-nunito font-semibold text-brand-brown mb-2">
                                Paso de Rutina
                            </label>
                            <select
                                {...register('routineStep')}
                                className="w-full px-4 py-3 bg-brand-cream rounded-2xl border-0 font-nunito text-brand-brown focus:ring-2 focus:ring-brand-orange"
                            >
                                <option value="">Sin paso asignado</option>
                                {Object.entries(ROUTINE_STEP_INFO).map(([key, info]) => (
                                    <option key={key} value={key}>
                                        {info.icon} {info.step > 0 ? `Paso ${info.step}: ` : ''}{info.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block font-nunito font-semibold text-brand-brown mb-2">
                                Modo de Uso
                            </label>
                            <textarea
                                {...register('howToUse')}
                                rows={3}
                                placeholder="Instrucciones de aplicación..."
                                className="w-full px-4 py-3 bg-brand-cream rounded-2xl border-0 font-nunito text-brand-brown placeholder:text-brand-brown/40 focus:ring-2 focus:ring-brand-orange resize-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Right Column - Complex Fields */}
                <div className="space-y-6">
                    {/* Images */}
                    <div className="bg-white rounded-3xl p-6 shadow-soft">
                        <label className="block font-nunito font-semibold text-brand-brown mb-4">
                            Imágenes 📸
                        </label>

                        {/* Image Preview Grid */}
                        <div className="grid grid-cols-3 gap-3 mb-4">
                            <AnimatePresence>
                                {allPreviewImages.map((img, index) => (
                                    <motion.div
                                        key={img.id}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        className="relative aspect-square rounded-2xl overflow-hidden bg-brand-cream group"
                                    >
                                        <Image
                                            src={img.preview}
                                            alt={`Imagen ${index + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => img.isExisting
                                                ? removeExistingImage(img.index!)
                                                : removePendingImage(img.id)
                                            }
                                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X size={14} />
                                        </button>
                                        {index === 0 && (
                                            <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-brand-orange text-white text-xs rounded-full font-nunito">
                                                Principal
                                            </span>
                                        )}
                                        {!img.isExisting && (
                                            <span className="absolute top-2 left-2 px-2 py-0.5 bg-pastel-blue text-blue-800 text-xs rounded-full font-nunito">
                                                Nueva
                                            </span>
                                        )}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Image Input Mode Selector */}
                        <div className="flex gap-2 mb-4">
                            <button
                                type="button"
                                onClick={() => setImageInputMode('file')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-nunito text-sm transition-colors ${imageInputMode === 'file'
                                    ? 'bg-brand-orange text-white'
                                    : 'bg-brand-cream text-brand-brown hover:bg-brand-cream-dark'
                                    }`}
                            >
                                <ImagePlus size={16} />
                                Subir archivo
                            </button>
                            <button
                                type="button"
                                onClick={() => setImageInputMode('url')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-nunito text-sm transition-colors ${imageInputMode === 'url'
                                    ? 'bg-brand-orange text-white'
                                    : 'bg-brand-cream text-brand-brown hover:bg-brand-cream-dark'
                                    }`}
                            >
                                <LinkIcon size={16} />
                                Desde URL
                            </button>
                        </div>

                        {/* File Upload */}
                        {imageInputMode === 'file' && (
                            <div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full py-4 border-2 border-dashed border-brand-orange/30 rounded-2xl text-brand-orange hover:bg-brand-orange/5 transition-colors flex items-center justify-center gap-2 font-nunito"
                                >
                                    <Upload size={20} />
                                    Seleccionar imágenes del dispositivo
                                </button>
                                <p className="text-xs text-brand-brown/50 text-center mt-2 font-nunito">
                                    Se aplicará automáticamente: eliminación de fondo, sombra suave y optimización
                                </p>
                            </div>
                        )}

                        {/* URL Input */}
                        {imageInputMode === 'url' && (
                            <div className="flex gap-2">
                                <input
                                    type="url"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addImageFromUrl())}
                                    placeholder="https://ejemplo.com/imagen.jpg"
                                    className="flex-1 px-4 py-3 bg-brand-cream rounded-2xl border-0 font-nunito text-brand-brown text-sm placeholder:text-brand-brown/40 focus:ring-2 focus:ring-brand-orange"
                                />
                                <button
                                    type="button"
                                    onClick={addImageFromUrl}
                                    className="px-4 py-3 bg-pastel-blue text-blue-800 rounded-2xl hover:bg-blue-200 transition-colors"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Tags Selector - Solo visible en modo create */}
                    <div className="bg-white rounded-3xl p-6 shadow-soft">
                        <div className="flex items-center gap-2 mb-4">
                            <Tag size={18} className="text-brand-brown" />
                            <label className="font-nunito font-semibold text-brand-brown">
                                Etiquetas {mode === 'create' ? '*' : '(Solo lectura)'}
                            </label>
                        </div>

                        {loadingTags ? (
                            <div className="flex items-center justify-center py-4">
                                <Loader2 size={20} className="animate-spin text-brand-orange" />
                                <span className="ml-2 font-nunito text-sm text-brand-brown/60">Cargando tags...</span>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {Object.entries(groupedTags).map(([type, tags]) => {
                                    const config = TAG_TYPE_CONFIG[type as TagTypeEnum];
                                    return (
                                        <div key={type}>
                                            <p className="text-xs font-nunito font-medium text-brand-brown/60 mb-2">
                                                {config.label}
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {tags.map((tag) => {
                                                    const isSelected = selectedTagIds.includes(tag.id);
                                                    return (
                                                        <button
                                                            key={tag.id}
                                                            type="button"
                                                            onClick={() => toggleTag(tag.id)}
                                                            disabled={mode === 'edit'}
                                                            className={`
                                                                px-3 py-1.5 rounded-full text-sm font-nunito
                                                                transition-all duration-200
                                                                ${isSelected
                                                                    ? `${config.color} ring-2 ring-offset-1 ring-brand-brown/20`
                                                                    : 'bg-brand-cream text-brand-brown/60 hover:bg-brand-cream-dark'
                                                                }
                                                                ${mode === 'edit' ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}
                                                            `}
                                                        >
                                                            {isSelected && <span className="mr-1">✓</span>}
                                                            {tag.name}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {mode === 'create' && selectedTagIds.length === 0 && !loadingTags && (
                            <p className="text-xs text-brand-orange mt-3 font-nunito">
                                ⚠️ Selecciona al menos un tag para categorizar el producto
                            </p>
                        )}

                        {mode === 'edit' && (
                            <p className="text-xs text-brand-brown/50 mt-3 font-nunito">
                                Los tags no se pueden editar después de crear el producto
                            </p>
                        )}
                    </div>

                    {/* Benefits - Chips System */}
                    <div className="bg-white rounded-3xl p-6 shadow-soft">
                        <label className="block font-nunito font-semibold text-brand-brown mb-4">
                            Beneficios ✨
                        </label>

                        <div className="flex flex-wrap gap-2 mb-4 min-h-[40px]">
                            <AnimatePresence>
                                {benefits.map((benefit, index) => (
                                    <motion.div
                                        key={benefit}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        className="group flex items-center gap-1 px-3 py-1.5 bg-pastel-green text-green-800 rounded-full font-nunito text-sm"
                                    >
                                        <Sparkles size={14} className="text-green-600" />
                                        <span>{benefit}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeBenefit(index)}
                                            className="p-0.5 hover:bg-green-200 rounded-full ml-1"
                                        >
                                            <X size={12} />
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newBenefit}
                                onChange={(e) => setNewBenefit(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
                                placeholder="Ej: Hidratación profunda"
                                className="flex-1 px-4 py-3 bg-brand-cream rounded-2xl border-0 font-nunito text-brand-brown text-sm placeholder:text-brand-brown/40 focus:ring-2 focus:ring-brand-orange"
                            />
                            <button
                                type="button"
                                onClick={addBenefit}
                                className="px-4 py-3 bg-pastel-green text-green-800 rounded-2xl hover:bg-green-200 transition-colors"
                            >
                                <Plus size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Key Ingredients */}
                    <div className="bg-white rounded-3xl p-6 shadow-soft">
                        <label className="block font-nunito font-semibold text-brand-brown mb-4">
                            Ingredientes Clave 🧪
                        </label>

                        <div className="space-y-2 mb-4">
                            <AnimatePresence>
                                {Object.entries(keyIngredients).map(([key, value]) => (
                                    <motion.div
                                        key={key}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="flex items-start gap-2 p-3 bg-pastel-purple/30 rounded-2xl group"
                                    >
                                        <div className="flex-1">
                                            <span className="font-nunito font-semibold text-sm text-purple-800">{key}</span>
                                            <ArrowRight size={12} className="inline mx-2 text-purple-400" />
                                            <span className="font-nunito text-sm text-brand-brown/80">{value}</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeIngredient(key)}
                                            className="p-1 hover:bg-purple-200 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X size={14} className="text-purple-600" />
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newIngredientKey}
                                onChange={(e) => setNewIngredientKey(e.target.value)}
                                placeholder="Ingrediente"
                                className="flex-1 px-4 py-3 bg-brand-cream rounded-2xl border-0 font-nunito text-brand-brown text-sm placeholder:text-brand-brown/40 focus:ring-2 focus:ring-brand-orange"
                            />
                            <input
                                type="text"
                                value={newIngredientValue}
                                onChange={(e) => setNewIngredientValue(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addIngredient())}
                                placeholder="Beneficio"
                                className="flex-1 px-4 py-3 bg-brand-cream rounded-2xl border-0 font-nunito text-brand-brown text-sm placeholder:text-brand-brown/40 focus:ring-2 focus:ring-brand-orange"
                            />
                            <button
                                type="button"
                                onClick={addIngredient}
                                className="px-4 py-3 bg-pastel-purple text-purple-800 rounded-2xl hover:bg-purple-200 transition-colors"
                            >
                                <Plus size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
