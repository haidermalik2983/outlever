import { NextRequest, NextResponse } from 'next/server';
import { searchPodcasts } from '@/lib/services/listenNotesService';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query');
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const page = parseInt(searchParams.get('page') || '1', 10);

    const podcasts = await searchPodcasts(query || '', limit, page);

    return NextResponse.json({ podcasts }, { status: 200 });
  } catch (error) {
    console.error('Error fetching podcasts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch podcasts' },
      { status: 500 }
    );
  }
} 