import { NextResponse } from 'next/server';
import quizzesData from '@/data/quizzes.json';

interface QuizSubmission {
  node_id: string;
  answers: Record<string, string>;
}

// POST /api/quiz/submit - Quiz cevaplarını değerlendir
export async function POST(request: Request) {
  try {
    const body: QuizSubmission = await request.json();
    const { node_id, answers } = body;

    const quizzes = quizzesData as Record<string, any[]>;
    const questions = quizzes[node_id];

    if (!questions || questions.length === 0) {
      return NextResponse.json({
        error: 'Quiz bulunamadı',
        passed: false,
        score: '0/0'
      }, { status: 404 });
    }

    // Cevapları değerlendir
    let correct = 0;
    const total = questions.length;
    const details: { questionId: string; correct: boolean; userAnswer: string; correctAnswer: string }[] = [];

    for (const question of questions) {
      const userAnswer = answers[question.id];
      const isCorrect = userAnswer === question.correct_answer;

      if (isCorrect) {
        correct++;
      }

      details.push({
        questionId: question.id,
        correct: isCorrect,
        userAnswer: userAnswer || '',
        correctAnswer: question.correct_answer
      });
    }

    const scorePercentage = Math.round((correct / total) * 100);
    const passed = scorePercentage >= 70; // %70 geçme notu

    return NextResponse.json({
      passed,
      score: `${correct}/${total}`,
      scorePercentage,
      correct,
      total,
      details,
      message: passed
        ? 'Tebrikler! Quizi başarıyla geçtiniz.'
        : 'Maalesef geçemediniz. Tekrar deneyin!'
    });
  } catch (error) {
    return NextResponse.json({
      error: 'Quiz değerlendirilemedi',
      passed: false
    }, { status: 500 });
  }
}
