// src/app/api/tags/route.ts
// API de tags - GET todos los tags

import { NextRequest, NextResponse } from 'next/server';
import { getAllTags, getTagsByType } from '@/src/services/product';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') as 'SKIN_TYPE' | 'CONCERN' | 'CATEGORY' | null;
    
    let tags;
    if (type && ['SKIN_TYPE', 'CONCERN', 'CATEGORY'].includes(type)) {
      tags = await getTagsByType(type);
    } else {
      tags = await getAllTags();
    }
    
    return NextResponse.json(tags);
  } catch (error) {
    console.error('Error in GET /api/tags:', error);
    return NextResponse.json(
      { error: 'Error fetching tags' },
      { status: 500 }
    );
  }
}
