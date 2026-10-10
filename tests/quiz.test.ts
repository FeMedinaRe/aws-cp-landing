import { describe, it, expect } from 'vitest';
import {
  buildSession,
  answerCurrent,
  advanceSession,
  sessionScore,
  isFinished,
  currentQuestion,
} from '../src/lib/quiz';
import { QUESTIONS } from '../src/data/questions';

describe('logica del cuestionario', () => {
  it('buildSession filtra por dominio', () => {
    const s = buildSession(QUESTIONS, { domainId: '2', limit: 5 });
    expect(s.questions.length).toBeGreaterThan(0);
    expect(s.questions.every((q) => q.domainId === '2')).toBe(true);
  });

  it('buildSession mixto incluye varios dominios', () => {
    const s = buildSession(QUESTIONS, { domainId: 'mixed', limit: 8 });
    const domains = new Set(s.questions.map((q) => q.domainId));
    expect(domains.size).toBeGreaterThan(1);
  });

  it('responder una pregunta registra acierto/fallo y avanza solo con advanceSession', () => {
    const s = buildSession(QUESTIONS, { domainId: 'mixed', limit: 3 });
    const q0 = s.questions[0];
    const ok = answerCurrent(s, q0.correctIndex);
    expect(ok).toBe(true);
    expect(s.answers[0]).toBe(q0.correctIndex);
    expect(s.currentIndex).toBe(0);
    advanceSession(s);
    expect(s.currentIndex).toBe(1);
  });

  it('respuesta incorrecta devuelve false y scoring cuenta solo aciertos', () => {
    const s = buildSession(QUESTIONS, { domainId: 'mixed', limit: 2 });
    const q0 = s.questions[0];
    const wrong = (q0.correctIndex + 1) % 4;
    expect(answerCurrent(s, wrong)).toBe(false);
    expect(isFinished(s)).toBe(false);
    advanceSession(s);
    const q1 = s.questions[1];
    expect(answerCurrent(s, q1.correctIndex)).toBe(true);
    expect(isFinished(s)).toBe(false);
    advanceSession(s);
    const score = sessionScore(s);
    expect(score.correct).toBe(1);
    expect(score.total).toBe(2);
    expect(score.percent).toBe(50);
    expect(isFinished(s)).toBe(true);
  });

  it('no permite responder fuera de rango ni dos veces la misma pregunta', () => {
    const s = buildSession(QUESTIONS, { domainId: 'mixed', limit: 1 });
    expect(() => answerCurrent(s, 99)).toThrow();
    expect(() => answerCurrent(s, -1)).toThrow();
    const q0 = s.questions[0];
    answerCurrent(s, q0.correctIndex);
    expect(() => answerCurrent(s, 0)).toThrow();
  });

  it('answerCurrent no avanza: currentQuestion sigue siendo la respondida hasta un avance explícito', () => {
    const s = buildSession(QUESTIONS, { domainId: 'mixed', limit: 3, shuffle: false });
    const q0 = currentQuestion(s);
    const ok = answerCurrent(s, q0.correctIndex);
    expect(ok).toBe(true);
    expect(s.answers[0]).toBe(q0.correctIndex);
    // La pregunta actual sigue siendo la respondida hasta avanzar.
    expect(s.currentIndex).toBe(0);
    expect(currentQuestion(s)).toBe(q0);
    expect(isFinished(s)).toBe(false);
    advanceSession(s);
    expect(s.currentIndex).toBe(1);
    expect(currentQuestion(s)).toBe(s.questions[1]);
  });

  it('advanceSession exige haber respondido la pregunta actual', () => {
    const s = buildSession(QUESTIONS, { domainId: 'mixed', limit: 2, shuffle: false });
    expect(() => advanceSession(s)).toThrow();
    expect(s.currentIndex).toBe(0);
    const q0 = currentQuestion(s);
    answerCurrent(s, q0.correctIndex);
    advanceSession(s);
    expect(s.currentIndex).toBe(1);
  });

  it('la sesión solo se completa tras avanzar más allá de la última pregunta', () => {
    const s = buildSession(QUESTIONS, { domainId: 'mixed', limit: 2, shuffle: false });
    const q0 = s.questions[0];
    answerCurrent(s, q0.correctIndex);
    advanceSession(s);
    expect(isFinished(s)).toBe(false);
    const q1 = currentQuestion(s);
    answerCurrent(s, q1.correctIndex);
    // Respondida la última, aún no está terminada hasta avanzar.
    expect(isFinished(s)).toBe(false);
    expect(s.currentIndex).toBe(1);
    advanceSession(s);
    expect(isFinished(s)).toBe(true);
    expect(s.currentIndex).toBe(2);
  });
});
