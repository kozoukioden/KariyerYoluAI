import { NextResponse } from 'next/server';
import tracksData from '@/data/tracks.json';

interface ChatRequest {
  message: string;
  history?: { role: 'user' | 'assistant'; content: string }[];
  current_track_id?: string;
}

// RAG için ders içeriklerini indeksle
function buildRAGIndex() {
  const documents: { text: string; title: string; trackId: string; nodeId: string }[] = [];
  const tracks = tracksData as Record<string, any>;

  for (const [trackId, track] of Object.entries(tracks)) {
    if (track.units) {
      for (const unit of track.units) {
        if (unit.nodes) {
          for (const node of unit.nodes) {
            if (node.content && node.content.trim().length > 20) {
              documents.push({
                text: node.content.toLowerCase(),
                title: node.title,
                trackId,
                nodeId: node.id
              });
            }
          }
        }
      }
    }
  }

  return documents;
}

// Basit arama fonksiyonu
function searchDocuments(query: string, documents: ReturnType<typeof buildRAGIndex>, trackId?: string) {
  const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);

  const scored = documents.map(doc => {
    let score = 0;

    // Kelime eşleşmesi
    for (const word of queryWords) {
      if (doc.text.includes(word)) {
        score += 10;
      }
      if (doc.title.toLowerCase().includes(word)) {
        score += 20;
      }
    }

    // Track boost
    if (trackId && doc.trackId === trackId) {
      score *= 1.5;
    }

    return { ...doc, score };
  });

  return scored
    .filter(d => d.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

// Groq API ile yanıt oluştur
async function generateWithGroq(message: string, context: string, history: ChatRequest['history']) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return null;
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `Sen KariyerYolu AI platformunun yazılım eğitim asistanısın. Türkçe yanıt ver.

Görevlerin:
- Yazılım geliştirme konularında sorulara yanıt ver
- Kariyer tavsiyeleri sun
- Kod örnekleri ve açıklamalar yap
- Öğrenme yolculuğunda rehberlik et

İşte mevcut ders içeriklerinden bağlam:
${context}

Kurallar:
- Sadece yazılım/teknoloji konularında yardım et
- Kısa ve öz yanıtlar ver
- Teknik terimleri açıkla
- Motivasyon verici ol`
          },
          ...(history || []).slice(-4).map(h => ({
            role: h.role as 'user' | 'assistant',
            content: h.content
          })),
          { role: 'user', content: message }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      console.error('Groq API error:', response.status);
      return null;
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || null;
  } catch (error) {
    console.error('Groq API error:', error);
    return null;
  }
}

// POST /api/chat - AI sohbet
export async function POST(request: Request) {
  try {
    const body: ChatRequest = await request.json();
    const { message, history, current_track_id } = body;

    if (!message || message.trim().length === 0) {
      return NextResponse.json({
        reply: 'Lütfen bir soru sorun.',
        source: 'error'
      });
    }

    // RAG indeksi oluştur ve arama yap
    const documents = buildRAGIndex();
    const relevantDocs = searchDocuments(message, documents, current_track_id);

    // Bağlam oluştur
    let context = '';
    if (relevantDocs.length > 0) {
      context = relevantDocs
        .map(d => `[${d.title}]: ${d.text.slice(0, 500)}...`)
        .join('\n\n');
    }

    // Önce Groq API'yi dene
    const groqResponse = await generateWithGroq(message, context, history);

    if (groqResponse) {
      return NextResponse.json({
        reply: groqResponse,
        source: 'ai',
        context: relevantDocs.map(d => ({ title: d.title, trackId: d.trackId }))
      });
    }

    // Groq yoksa RAG tabanlı yanıt
    if (relevantDocs.length > 0) {
      const bestDoc = relevantDocs[0];
      const snippet = bestDoc.text.slice(0, 400);

      return NextResponse.json({
        reply: `**${bestDoc.title}** dersinde bu konu şöyle açıklanıyor:\n\n${snippet}...\n\nDaha fazla bilgi için ilgili dersi inceleyebilirsin!`,
        source: 'rag',
        context: relevantDocs.map(d => ({ title: d.title, trackId: d.trackId }))
      });
    }

    // Hiçbir sonuç bulunamadı
    const fallbackResponses = [
      'Bu konuda müfredatta yeterli bilgi bulamadım. Belki soruyu farklı şekilde sormayı deneyebilirsin?',
      'Şu an bu soruya net bir cevap veremiyorum. Derslerini tamamladıkça daha fazla bilgi edineceğiz!',
      'Bu konu henüz müfredatımızda detaylı işlenmemiş. Yakında daha fazla içerik eklenecek!',
    ];

    return NextResponse.json({
      reply: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
      source: 'fallback'
    });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json({
      reply: 'Bir hata oluştu. Lütfen tekrar deneyin.',
      source: 'error'
    }, { status: 500 });
  }
}
