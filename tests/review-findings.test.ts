import { describe, it, expect } from 'vitest';
import { DOMAINS } from '../src/data/domains';
import mainSrc from '../src/main.ts?raw';
// Nota TDD (RED): este fichero espera la constante exportada QUIZ_PASS_THRESHOLD
// y la función isPassing en src/lib/quiz.ts (aún no existen -> debe fallar en RED).
import { QUIZ_PASS_THRESHOLD, isPassing } from '../src/lib/quiz';

describe('hallazgos de revisión independiente (RED primero)', () => {
  it('existe un umbral único de aprobado exportado y vale 70', () => {
    expect(QUIZ_PASS_THRESHOLD).toBe(70);
  });

  it('isPassing aprueba con >= umbral y suspende por debajo', () => {
    expect(isPassing(70)).toBe(true);
    expect(isPassing(69)).toBe(false);
    expect(isPassing(100)).toBe(true);
  });

  it('el texto de guía ("repite el quiz...") usa el mismo umbral que la lógica', () => {
    // La copia debe mencionar el 70 % (no el 80 %) para ser consistente con QUIZ_PASS_THRESHOLD=70.
    expect(mainSrc).toMatch(/repite el quiz hasta.*70\s?%/);
    expect(mainSrc).not.toMatch(/repite el quiz hasta superar el 80\s?%/);
    // La lógica de resultado no debe usar un literal 70 suelto sino la constante/función.
    expect(mainSrc).toMatch(/QUIZ_PASS_THRESHOLD|isPassing/);
  });

  it('KMS no se presenta como responsable del cifrado en tránsito (TLS)', () => {
    const lesson = DOMAINS.flatMap((d) => d.lessons).find((l) => l.id === '2-proteccion');
    expect(lesson).toBeDefined();
    const body = lesson!.body;
    const keyPoints = lesson!.keyPoints.join('\n');
    // No debe atribuir a KMS el cifrado en tránsito: patrones incorrectos habituales.
    expect(body).not.toMatch(/KMS[^.]*cifrado en reposo[^.]*y en tránsito/i);
    expect(body).not.toMatch(/KMS para[^.]*en tránsito/i);
    expect(body).not.toMatch(/KMS gestiona[^.]*en tránsito \(TLS\)/i);
    expect(keyPoints).not.toMatch(/KMS para claves y cifrado en reposo y en tránsito/i);
    // Si KMS y "en tránsito" coaparecen, debe ser para distinguirlos explícitamente.
    if (/KMS/i.test(body) && /en tránsito/i.test(body)) {
      expect(body).toMatch(/distinto de KMS|no es una función de KMS|mecanismo distinto/i);
    }
  });

  it('la lección distingue KMS (reposo) de TLS en tránsito', () => {
    const lesson = DOMAINS.flatMap((d) => d.lessons).find((l) => l.id === '2-proteccion');
    expect(lesson).toBeDefined();
    const combined = `${lesson!.body}\n${lesson!.keyPoints.join('\n')}`;
    // Debe mencionar KMS asociado a reposo y TLS como mecanismo aparte en tránsito.
    expect(combined).toMatch(/KMS/i);
    expect(combined).toMatch(/reposo/i);
    expect(combined).toMatch(/TLS/);
  });
});
