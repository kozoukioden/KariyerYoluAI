import { NextResponse } from 'next/server';
import tracksData from '@/data/tracks.json';

// GET /api/tracks - Tüm track listesi
export async function GET() {
  try {
    const trackList = Object.values(tracksData).map((track: any) => ({
      id: track.id,
      title: track.title,
      description: track.description,
      totalUnits: track.units?.length || 0,
      totalNodes: track.units?.reduce((sum: number, unit: any) => sum + (unit.nodes?.length || 0), 0) || 0,
    }));

    return NextResponse.json(trackList);
  } catch (error) {
    return NextResponse.json({ error: 'Tracks yüklenemedi' }, { status: 500 });
  }
}
