import { NextResponse } from 'next/server';
import quizzesData from '@/data/quizzes.json';

// GET /api/quiz/[nodeId] - Quiz soruları
export async function GET(
  request: Request,
  { params }: { params: Promise<{ nodeId: string }> }
) {
  try {
    const { nodeId } = await params;
    const quizzes = quizzesData as Record<string, any[]>;
    const questions = quizzes[nodeId];

    if (!questions || questions.length === 0) {
      return NextResponse.json({
        questions: [],
        message: 'Bu ders için henüz quiz hazırlanmamış'
      });
    }

    // Soruları karıştır (shuffle)
    const shuffledQuestions = [...questions].sort(() => Math.random() - 0.5);

    return NextResponse.json({ questions: shuffledQuestions });
  } catch (error) {
    return NextResponse.json({ error: 'Quiz yüklenemedi' }, { status: 500 });
  }
}
