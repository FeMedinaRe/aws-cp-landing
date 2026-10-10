export const STORAGE_KEY = 'clf-c02-progress-v1';

export interface QuizResult {
  date: string;
  domainId: string;
  correct: number;
  total: number;
}

export interface Progress {
  completedLessons: Record<string, boolean>;
  quizResults: QuizResult[];
}

export function emptyProgress(): Progress {
  return { completedLessons: {}, quizResults: [] };
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function sanitize(raw: unknown): Progress {
  if (!isRecord(raw)) return emptyProgress();
  const completedLessons: Record<string, boolean> = {};
  const cl = raw['completedLessons'];
  if (isRecord(cl)) {
    for (const [k, v] of Object.entries(cl)) {
      if (typeof k === 'string' && v === true) completedLessons[k] = true;
    }
  }
  const quizResults: QuizResult[] = [];
  const qr = raw['quizResults'];
  if (Array.isArray(qr)) {
    for (const item of qr) {
      if (!isRecord(item)) continue;
      const { date, domainId, correct, total } = item as Record<string, unknown>;
      if (
        typeof date === 'string' &&
        typeof domainId === 'string' &&
        typeof correct === 'number' &&
        Number.isFinite(correct) &&
        typeof total === 'number' &&
        Number.isFinite(total) &&
        total > 0 &&
        correct >= 0 &&
        correct <= total
      ) {
        quizResults.push({ date, domainId, correct, total });
      }
    }
  }
  return { completedLessons, quizResults };
}

export function loadProgress(storage: Storage): Progress {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return emptyProgress();
    return sanitize(JSON.parse(raw));
  } catch {
    return emptyProgress();
  }
}

export function saveProgress(storage: Storage, progress: Progress): void {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(sanitize(progress)));
  } catch {
    // almacenamiento lleno o no disponible: no romper la app
  }
}

export function resetProgress(storage: Storage): Progress {
  try {
    storage.removeItem(STORAGE_KEY);
  } catch {
    // ignorar
  }
  return emptyProgress();
}

export function markLessonComplete(progress: Progress, lessonId: string): Progress {
  return {
    ...progress,
    completedLessons: { ...progress.completedLessons, [lessonId]: true },
  };
}

export function recordQuizResult(progress: Progress, result: QuizResult): Progress {
  return {
    ...progress,
    quizResults: [...progress.quizResults, result].slice(-50),
  };
}
