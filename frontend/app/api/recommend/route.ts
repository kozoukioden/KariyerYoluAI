import { NextResponse } from 'next/server';
import tracksData from '@/data/tracks.json';

interface SurveyAnswers {
  experience_level?: string;
  interest_area?: string;
  platform_preference?: string;
  work_style?: string;
  learning_goal?: string;
  time_commitment?: string;
  problem_solving?: string;
  creativity_level?: string;
  team_preference?: string;
  tech_interest?: string;
  // Eski format uyumluluğu
  interest_core?: string;
  platform?: string;
}

interface TrackScore {
  trackId: string;
  score: number;
  reasons: string[];
}

// Track ID'leri (tracks.json ile eşleşmeli)
const TRACK_IDS = {
  FRONTEND: 'frontend_developer',
  BACKEND: 'backend_developer',
  FULLSTACK: 'fullstack_developer',
  MOBILE_IOS: 'mobile_ios_developer',
  MOBILE_ANDROID: 'mobile_android_developer',
  MOBILE_CROSS: 'mobile_cross_developer',
  GAME: 'game_developer',
  CYBER: 'cybersecurity', // Düzeltildi: cyber_security -> cybersecurity
  DEVOPS: 'devops_engineer',
  DATA_SCIENCE: 'data_scientist',
  ML: 'ml_engineer',
  DATABASE: 'database_admin',
  UIUX: 'ui_ux_designer',
  BLOCKCHAIN: 'blockchain_developer',
};

// POST /api/recommend - Kariyer önerisi
export async function POST(request: Request) {
  try {
    const answers: SurveyAnswers = await request.json();
    const tracks = tracksData as Record<string, any>;

    // Her track için skor hesapla
    const scores: Record<string, TrackScore> = {};

    // Tüm track'ler için başlangıç skoru
    Object.keys(tracks).forEach(trackId => {
      scores[trackId] = { trackId, score: 0, reasons: [] };
    });

    // Platform tercihi
    const platform = answers.platform_preference || answers.platform;
    if (platform === 'web') {
      addScore(scores, TRACK_IDS.FRONTEND, 30, 'Web platformu tercihi');
      addScore(scores, TRACK_IDS.BACKEND, 25, 'Web platformu tercihi');
      addScore(scores, TRACK_IDS.FULLSTACK, 35, 'Web platformu tercihi');
    } else if (platform === 'mobile') {
      addScore(scores, TRACK_IDS.MOBILE_IOS, 30, 'Mobil platform tercihi');
      addScore(scores, TRACK_IDS.MOBILE_ANDROID, 30, 'Mobil platform tercihi');
      addScore(scores, TRACK_IDS.MOBILE_CROSS, 35, 'Mobil platform tercihi');
    } else if (platform === 'game') {
      addScore(scores, TRACK_IDS.GAME, 50, 'Oyun platformu tercihi');
    } else if (platform === 'backend' || platform === 'cloud') {
      addScore(scores, TRACK_IDS.BACKEND, 30, 'Backend/Cloud tercihi');
      addScore(scores, TRACK_IDS.DEVOPS, 35, 'Backend/Cloud tercihi');
      addScore(scores, TRACK_IDS.DATABASE, 25, 'Backend/Cloud tercihi');
    }

    // İlgi alanı
    const interest = answers.interest_area || answers.interest_core;
    if (interest === 'visual') {
      addScore(scores, TRACK_IDS.FRONTEND, 25, 'Görsel tasarım ilgisi');
      addScore(scores, TRACK_IDS.UIUX, 40, 'Görsel tasarım ilgisi');
      addScore(scores, TRACK_IDS.GAME, 20, 'Görsel tasarım ilgisi');
    } else if (interest === 'logic') {
      addScore(scores, TRACK_IDS.BACKEND, 25, 'Mantıksal problem çözme');
      addScore(scores, TRACK_IDS.DATA_SCIENCE, 30, 'Mantıksal problem çözme');
      addScore(scores, TRACK_IDS.ML, 30, 'Mantıksal problem çözme');
    } else if (interest === 'data') {
      addScore(scores, TRACK_IDS.DATA_SCIENCE, 40, 'Veri analizi ilgisi');
      addScore(scores, TRACK_IDS.ML, 35, 'Veri analizi ilgisi');
      addScore(scores, TRACK_IDS.DATABASE, 30, 'Veri analizi ilgisi');
    } else if (interest === 'security') {
      addScore(scores, TRACK_IDS.CYBER, 50, 'Güvenlik ilgisi');
      addScore(scores, TRACK_IDS.DEVOPS, 20, 'Güvenlik ilgisi');
    } else if (interest === 'infrastructure') {
      addScore(scores, TRACK_IDS.DEVOPS, 40, 'Altyapı ilgisi');
      addScore(scores, TRACK_IDS.BACKEND, 25, 'Altyapı ilgisi');
    }

    // Çalışma stili
    const workStyle = answers.work_style;
    if (workStyle === 'frontend') {
      addScore(scores, TRACK_IDS.FRONTEND, 20, 'Frontend çalışma tercihi');
      addScore(scores, TRACK_IDS.UIUX, 15, 'Frontend çalışma tercihi');
    } else if (workStyle === 'backend') {
      addScore(scores, TRACK_IDS.BACKEND, 20, 'Backend çalışma tercihi');
      addScore(scores, TRACK_IDS.DATABASE, 15, 'Backend çalışma tercihi');
    } else if (workStyle === 'fullstack') {
      addScore(scores, TRACK_IDS.FULLSTACK, 25, 'Full-stack çalışma tercihi');
    } else if (workStyle === 'solo') {
      // Solo çalışma tercihi - frontend ve freelance friendly track'ler
      addScore(scores, TRACK_IDS.FRONTEND, 10, 'Bağımsız çalışma tercihi');
      addScore(scores, TRACK_IDS.UIUX, 10, 'Bağımsız çalışma tercihi');
    }

    // Deneyim seviyesi
    const experience = answers.experience_level;
    if (experience === 'beginner') {
      // Yeni başlayanlar için daha kolay başlangıç track'leri öner
      addScore(scores, TRACK_IDS.FRONTEND, 15, 'Başlangıç için uygun');
      addScore(scores, TRACK_IDS.UIUX, 10, 'Başlangıç için uygun');
    } else if (experience === 'advanced') {
      // İleri seviye için uzmanlaşma track'leri
      addScore(scores, TRACK_IDS.ML, 15, 'İleri seviye uzmanlık');
      addScore(scores, TRACK_IDS.BLOCKCHAIN, 15, 'İleri seviye uzmanlık');
      addScore(scores, TRACK_IDS.CYBER, 15, 'İleri seviye uzmanlık');
    }

    // Problem çözme tercihi
    if (answers.problem_solving === 'analytical') {
      addScore(scores, TRACK_IDS.DATA_SCIENCE, 15, 'Analitik yaklaşım');
      addScore(scores, TRACK_IDS.BACKEND, 10, 'Analitik yaklaşım');
    } else if (answers.problem_solving === 'creative') {
      addScore(scores, TRACK_IDS.UIUX, 15, 'Yaratıcı yaklaşım');
      addScore(scores, TRACK_IDS.GAME, 15, 'Yaratıcı yaklaşım');
    }

    // Tech interest
    if (answers.tech_interest === 'ai_ml') {
      addScore(scores, TRACK_IDS.ML, 30, 'AI/ML ilgisi');
      addScore(scores, TRACK_IDS.DATA_SCIENCE, 25, 'AI/ML ilgisi');
    } else if (answers.tech_interest === 'blockchain') {
      addScore(scores, TRACK_IDS.BLOCKCHAIN, 40, 'Blockchain ilgisi');
    } else if (answers.tech_interest === 'cloud') {
      addScore(scores, TRACK_IDS.DEVOPS, 30, 'Cloud ilgisi');
    }

    // En yüksek skorlu track'leri bul
    const sortedTracks = Object.values(scores)
      .filter(s => tracks[s.trackId]) // Sadece mevcut track'ler
      .sort((a, b) => b.score - a.score);

    // İlk 3 öneriyi al
    const topRecommendations = sortedTracks.slice(0, 3).map(s => {
      const track = tracks[s.trackId];
      return {
        track_id: s.trackId,
        title: track?.title || s.trackId,
        description: track?.description || '',
        score: s.score,
        reasons: s.reasons,
        match_percentage: Math.min(Math.round((s.score / 100) * 100), 100)
      };
    });

    // En iyi öneri
    const bestMatch = topRecommendations[0];

    return NextResponse.json({
      track_id: bestMatch?.track_id || 'frontend_developer',
      title: bestMatch?.title || 'Frontend Developer',
      description: bestMatch?.description || '',
      match_percentage: bestMatch?.match_percentage || 50,
      reasons: bestMatch?.reasons || ['Varsayılan öneri'],
      alternatives: topRecommendations.slice(1)
    });
  } catch (error) {
    console.error('Recommend error:', error);
    return NextResponse.json({
      track_id: 'frontend_developer',
      title: 'Frontend Developer',
      description: 'Web arayüzleri geliştir',
      match_percentage: 50,
      reasons: ['Varsayılan öneri'],
      alternatives: []
    });
  }
}

function addScore(scores: Record<string, TrackScore>, trackId: string, points: number, reason: string) {
  if (scores[trackId]) {
    scores[trackId].score += points;
    if (!scores[trackId].reasons.includes(reason)) {
      scores[trackId].reasons.push(reason);
    }
  }
}
