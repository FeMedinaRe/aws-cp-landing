import { describe, it, expect } from 'vitest';
import cssRaw from '../src/styles.css?raw';
// @ts-ignore - tipos node no instalados a proposito (evita dependencia extra)
import { readFileSync } from 'node:fs';
// @ts-ignore - tipos node no instalados a proposito (evita dependencia extra)
import { resolve } from 'node:path';

declare const process: any;

// Vitest mockea los imports CSS y `?raw` puede llegar vacío;
// mantenemos el import `?raw` exigido y recurrimos al archivo real.
const css: string =
  typeof cssRaw === 'string' && cssRaw.length > 0
    ? cssRaw
    : readFileSync(resolve(process.cwd(), 'src/styles.css'), 'utf8');

function extractRootVar(name: string): string | null {
  const rootMatch = css.match(/:root\s*{([^}]*)}/);
  if (!rootMatch) return null;
  const block = rootMatch[1];
  const re = new RegExp(`${name}\\s*:\\s*([^;]+);`);
  const m = block.match(re);
  return m ? m[1].trim() : null;
}

function hexToRgb(hex: string): [number, number, number] {
  let h = hex.trim().toLowerCase();
  if (!h.startsWith('#')) throw new Error(`not a hex color: ${hex}`);
  h = h.slice(1);
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const n = parseInt(h.slice(0, 6), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function relLuminance([r, g, b]: [number, number, number]): number {
  const f = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

function contrast(a: string, b: string): number {
  const l1 = relLuminance(hexToRgb(a));
  const l2 = relLuminance(hexToRgb(b));
  const [hi, lo] = l1 >= l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

describe('dark theme por defecto (issue #3)', () => {
  it('tokens base de fondo/superficie son oscuros', () => {
    const bg = extractRootVar('--bg');
    const card = extractRootVar('--card');
    expect(bg, '--bg debe existir').toBeTruthy();
    expect(card, '--card debe existir').toBeTruthy();
    const bgLum = relLuminance(hexToRgb(bg!));
    const cardLum = relLuminance(hexToRgb(card!));
    // Superficies oscuras: luminancia relativa baja (< 0.25).
    // La paleta clara actual (#f6f7fb / #ffffff) queda en ~0.9-1.0 y falla (RED).
    expect(bgLum).toBeLessThan(0.25);
    expect(cardLum).toBeLessThan(0.25);
  });

  it('contraste texto/fondo accesible (>= 4.5:1)', () => {
    const bg = extractRootVar('--bg')!;
    const ink = extractRootVar('--ink')!;
    const muted = extractRootVar('--muted')!;
    expect(contrast(ink, bg)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(muted, bg)).toBeGreaterThanOrEqual(4.5);
  });

  it('no usa modo claro dependiente del SO; la base misma es oscura', () => {
    expect(css).not.toMatch(/prefers-color-scheme\s*:\s*light/);
  });

  it('sin superficies duras claras/blancas', () => {
    const lowered = css.toLowerCase();
    for (const light of ['#ffffff', '#f6f7fb', '#f2f5ff', '#eef4ff', '#eef1f7', '#e8ebf3', '#e6f5ec', '#fdecea', '#fff8e6']) {
      expect(lowered, `no debe contener superficie clara ${light}`).not.toContain(light);
    }
    // background:#fff con o sin espacio (fondos blancos). El color de texto #fff sigue permitido.
    expect(lowered).not.toMatch(/background\s*:\s*#fff\b/);
  });

  it('preserva el acento naranja AWS', () => {
    const accent = extractRootVar('--accent');
    expect(accent?.toLowerCase()).toBe('#ff9900');
  });
});
