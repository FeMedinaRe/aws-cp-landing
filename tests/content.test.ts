import { describe, it, expect } from 'vitest';
import { DOMAINS } from '../src/data/domains';
import { QUESTIONS } from '../src/data/questions';

describe('mapeo de dominios y contenido', () => {
  it('existen exactamente 4 dominios oficiales', () => {
    expect(DOMAINS).toHaveLength(4);
  });

  it('pesos oficiales son 24, 30, 34 y 12 y suman 100', () => {
    const weights = DOMAINS.map((d) => d.weight);
    expect(weights).toEqual([24, 30, 34, 12]);
    expect(weights.reduce((a, b) => a + b, 0)).toBe(100);
  });

  it('cada dominio tiene id, titulo, objetivos y lecciones en español', () => {
    for (const d of DOMAINS) {
      expect(d.id).toMatch(/^[1-4]$/);
      expect(d.titleEs.length).toBeGreaterThan(5);
      expect(d.titleEn.length).toBeGreaterThan(5);
      expect(d.objectives.length).toBeGreaterThanOrEqual(3);
      expect(d.lessons.length).toBeGreaterThanOrEqual(2);
      for (const lesson of d.lessons) {
        expect(lesson.title.length).toBeGreaterThan(5);
        expect(lesson.body.length).toBeGreaterThan(80);
        expect(lesson.keyPoints.length).toBeGreaterThanOrEqual(3);
      }
    }
  });

  it('hay preguntas originales para cada dominio (minimo 6 por dominio)', () => {
    for (const d of DOMAINS) {
      const count = QUESTIONS.filter((q) => q.domainId === d.id).length;
      expect(count).toBeGreaterThanOrEqual(6);
    }
  });

  it('cada pregunta tiene 4 opciones, indice valido y explicacion', () => {
    for (const q of QUESTIONS) {
      expect(DOMAINS.map((d) => d.id)).toContain(q.domainId);
      expect(q.questionEs.length).toBeGreaterThan(15);
      expect(q.options).toHaveLength(4);
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThan(4);
      expect(q.explanation.length).toBeGreaterThan(20);
      expect(q.id.length).toBeGreaterThan(2);
    }
  });

  it('ids de preguntas son unicos', () => {
    const ids = QUESTIONS.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
