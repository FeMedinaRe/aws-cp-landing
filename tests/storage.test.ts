import { describe, it, expect, beforeEach } from 'vitest';
import {
  loadProgress,
  saveProgress,
  resetProgress,
  recordQuizResult,
  markLessonComplete,
  STORAGE_KEY,
} from '../src/lib/storage';

function memStorage(initial: Record<string, string> = {}) {
  const store: Record<string, string> = { ...initial };
  return {
    getItem: (k: string) => (k in store ? store[k] : null),
    setItem: (k: string, v: string) => {
      store[k] = v;
    },
    removeItem: (k: string) => {
      delete store[k];
    },
    _store: store,
  };
}

describe('persistencia segura en localStorage', () => {
  it('devuelve progreso vacio si no hay nada guardado', () => {
    const p = loadProgress(memStorage() as unknown as Storage);
    expect(p.completedLessons).toEqual({});
    expect(p.quizResults).toEqual([]);
  });

  it('tolera JSON malformado sin lanzar', () => {
    const storage = memStorage({ [STORAGE_KEY]: '{no-json!!!' });
    const p = loadProgress(storage as unknown as Storage);
    expect(p.completedLessons).toEqual({});
    expect(p.quizResults).toEqual([]);
  });

  it('tolera formas inesperadas (null, array, tipos erroneos)', () => {
    for (const bad of ['null', '[]', '"hola"', '42', '{"completedLessons":[1]}']) {
      const storage = memStorage({ [STORAGE_KEY]: bad });
      const p = loadProgress(storage as unknown as Storage);
      expect(p.completedLessons).toEqual({});
      expect(p.quizResults).toEqual([]);
    }
  });

  it('guardar y cargar conserva lecciones y resultados', () => {
    const storage = memStorage() as unknown as Storage;
    let p = loadProgress(storage);
    p = markLessonComplete(p, '1-leccion-1');
    p = recordQuizResult(p, {
      date: '2026-01-01',
      domainId: 'mixed',
      correct: 7,
      total: 10,
    });
    saveProgress(storage, p);
    const reloaded = loadProgress(storage);
    expect(reloaded.completedLessons['1-leccion-1']).toBe(true);
    expect(reloaded.quizResults).toHaveLength(1);
    expect(reloaded.quizResults[0].correct).toBe(7);
  });

  it('reset borra el almacenamiento', () => {
    const storage = memStorage() as unknown as Storage;
    let p = loadProgress(storage);
    p = markLessonComplete(p, '2-x');
    saveProgress(storage, p);
    resetProgress(storage);
    const reloaded = loadProgress(storage);
    expect(reloaded.quizResults).toEqual([]);
    expect(reloaded.completedLessons).toEqual({});
  });
});
