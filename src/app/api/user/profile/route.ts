// src/app/api/user/profile/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prismaClientGlobal } from '@/src/app/lib/prisma';
import { ShippingZone, ShippingModality } from '@prisma/client';

export async function GET() {
    const session = await auth();

    if (!session?.user?.id) {
        return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    try {
        const profile = await prismaClientGlobal.user.findUnique({
            where: { id: session.user.id },
            select: {
                id: true,
                name: true,
                email: true,
                dni: true,
                phone: true,
                department: true,
                province: true,
                district: true,
                address: true,
                reference: true,
                locationUrl: true,
                shippingZone: true,
                shippingModality: true,
                profileComplete: true,
                purrPoints: true,
            },
        });

        return NextResponse.json({ profile });
    } catch (error) {
        console.error('Error fetching profile:', error);
        return NextResponse.json({ error: 'Error al obtener perfil' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    const session = await auth();

    if (!session?.user?.id) {
        return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const {
            name,
            dni,
            phone,
            department,
            province,
            district,
            address,
            reference,
            locationUrl,
            shippingZone,
            shippingModality,
        } = body;

        // Validate required fields
        if (!name || !dni || !phone || !department || !province || !district || !address) {
            return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
        }

        // Validate DNI format (8 digits)
        if (!/^\d{8}$/.test(dni)) {
            return NextResponse.json({ error: 'DNI debe tener 8 dígitos' }, { status: 400 });
        }

        // Validate phone format (9 digits starting with 9)
        if (!/^9\d{8}$/.test(phone)) {
            return NextResponse.json({ error: 'Teléfono inválido' }, { status: 400 });
        }

        const updatedProfile = await prismaClientGlobal.user.update({
            where: { id: session.user.id },
            data: {
                name,
                dni,
                phone,
                department,
                province,
                district,
                address,
                reference: reference || null,
                locationUrl: locationUrl || null,
                shippingZone: shippingZone as ShippingZone,
                shippingModality: shippingModality as ShippingModality,
                profileComplete: true,
            },
            select: {
                id: true,
                name: true,
                profileComplete: true,
            },
        });

        return NextResponse.json({ profile: updatedProfile, success: true });
    } catch (error) {
        console.error('Error updating profile:', error);
        return NextResponse.json({ error: 'Error al guardar perfil' }, { status: 500 });
    }
}
