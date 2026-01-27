import { NextResponse } from 'next/server';
import tracksData from '@/data/tracks.json';

// GET /api/tracks/[id] - Tek track detayı
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tracks = tracksData as Record<string, any>;
    const track = tracks[id];

    if (!track) {
      return NextResponse.json({ error: 'Track bulunamadı' }, { status: 404 });
    }

    return NextResponse.json(track);
  } catch (error) {
    return NextResponse.json({ error: 'Track yüklenemedi' }, { status: 500 });
  }
}
