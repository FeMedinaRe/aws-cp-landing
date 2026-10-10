import type { Question } from '../data/questions';

export interface QuizOptions {
  domainId: string; // '1' | '2' | '3' | '4' | 'mixed'
  limit: number;
  shuffle?: boolean;
}

export interface QuizSession {
  questions: Question[];
  answers: number[];
  currentIndex: number;
  domainId: string;
}

/** Umbral único de aprobado del quiz de práctica (porcentaje). */
export const QUIZ_PASS_THRESHOLD = 70;

export function isPassing(percent: number): boolean {
  return percent >= QUIZ_PASS_THRESHOLD;
}

export function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function buildSession(all: Question[], opts: QuizOptions): QuizSession {
  const pool =
    opts.domainId === 'mixed'
      ? [...all]
      : all.filter((q) => q.domainId === opts.domainId);
  const ordered = opts.shuffle === false ? pool : shuffleArray(pool);
  const questions = ordered.slice(0, Math.max(1, opts.limit));
  return { questions, answers: [], currentIndex: 0, domainId: opts.domainId };
}

export function currentQuestion(session: QuizSession): Question {
  if (session.currentIndex >= session.questions.length) {
    throw new Error('No hay más preguntas en la sesión.');
  }
  return session.questions[session.currentIndex];
}

export function answerCurrent(session: QuizSession, selectedIndex: number): boolean {
  if (!Number.isInteger(selectedIndex) || selectedIndex < 0 || selectedIndex > 3) {
    throw new Error('Índice de respuesta fuera de rango (0-3).');
  }
  if (session.currentIndex >= session.questions.length) {
    throw new Error('La sesión ya terminó.');
  }
  if (session.answers.length !== session.currentIndex) {
    throw new Error('La pregunta actual ya fue respondida.');
  }
  const q = session.questions[session.currentIndex];
  session.answers.push(selectedIndex);
  return selectedIndex === q.correctIndex;
}

export function advanceSession(session: QuizSession): void {
  if (session.currentIndex >= session.questions.length) {
    throw new Error('La sesión ya terminó.');
  }
  if (session.answers.length !== session.currentIndex + 1) {
    throw new Error('Debe responder la pregunta actual antes de avanzar.');
  }
  session.currentIndex += 1;
}

export function sessionScore(session: QuizSession): {
  correct: number;
  total: number;
  percent: number;
} {
  let correct = 0;
  session.answers.forEach((a, i) => {
    if (a === session.questions[i]?.correctIndex) correct += 1;
  });
  const total = session.questions.length;
  const percent = total === 0 ? 0 : Math.round((correct / total) * 100);
  return { correct, total, percent };
}

export function isFinished(session: QuizSession): boolean {
  return session.currentIndex >= session.questions.length;
}
