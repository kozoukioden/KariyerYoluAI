import { NextResponse } from 'next/server';
import tracksData from '@/data/tracks.json';

// GET /api/node/[nodeId] - Node içeriği
export async function GET(
  request: Request,
  { params }: { params: Promise<{ nodeId: string }> }
) {
  try {
    const { nodeId } = await params;
    const tracks = tracksData as Record<string, any>;

    // Tüm track'lerde node'u ara
    for (const [trackId, track] of Object.entries(tracks)) {
      if (track.units) {
        for (const unit of track.units) {
          if (unit.nodes) {
            for (const node of unit.nodes) {
              if (node.id === nodeId) {
                return NextResponse.json({
                  id: node.id,
                  title: node.title,
                  description: node.description,
                  content: node.content || '',
                  type: node.type,
                  difficulty: node.difficulty,
                  estimated_time: node.estimated_time,
                  trackId,
                  unitId: unit.id,
                  unitTitle: unit.title
                });
              }
            }
          }
        }
      }
    }

    return NextResponse.json({ error: 'Node bulunamadı' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: 'Node yüklenemedi' }, { status: 500 });
  }
}
