# Guía CLF-C02 en español (no oficial)

Sitio estático de estudio para **AWS Certified Cloud Practitioner (CLF-C02)**, en español.
Vite + TypeScript vainilla, sin dependencias en tiempo de ejecución ni recursos remotos.

> **Aviso:** contenido de estudio independiente y **no oficial**. Las preguntas de
> práctica son originales y **no** son preguntas reales del examen ni están afiliadas a AWS.
> Fuentes oficiales:
> - Guía del examen: https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/cloud-practitioner-02.html
> - Servicios en el alcance: https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/clf-02-in-scope-services.html

## Dominios y pesos oficiales

| Dominio | Título | Peso |
|---|---|---|
| 1 | Conceptos de la nube (Cloud Concepts) | 24 % |
| 2 | Seguridad y cumplimiento (Security and Compliance) | 30 % |
| 3 | Tecnología y servicios en la nube (Cloud Technology and Services) | 34 % |
| 4 | Facturación, precios y soporte (Billing, Pricing, and Support) | 12 % |

## Funciones

- Lecciones en español por dominio, con objetivos, puntos clave y ejemplos.
- Quiz original de opción múltiple: por dominio o mixto, una pregunta a la vez,
  con explicación, puntuación y reintento. Marcado como no oficial.
- Progreso (lecciones + intentos) en `localStorage` con tolerancia a datos
  malformados y botón de borrado.
- Accesible: HTML semántico, teclado completo, foco visible, `aria-live` y responsive.

## Desarrollo

Requiere Node 20.

```bash
npm install
npm test      # Vitest (pruebas de contenido, quiz y persistencia)
npm run dev   # servidor local
npm run build # tsc + vite build -> dist/
```

## GitHub Pages (subruta)

`vite.config.ts` usa `base: './'` (o `BASE_PATH` si se define), por lo que el
sitio funciona tanto en dominio raíz como bajo `https://<usuario>.github.io/<repo>/`.

```bash
BASE_PATH=/mi-repo/ npm run build
```

El workflow `.github/workflows/deploy.yml` compila y despliega `dist/` con
artefacto oficial de Pages (`upload-pages-artifact` + `deploy-pages`).
Activa **Settings → Pages → Source: GitHub Actions** en el repositorio.
No se ha creado ningún remoto desde este entorno.

## Estructura

- `index.html` — shell semántico y navegación
- `src/main.ts` — SPA vainilla (hash routing, quiz, progreso)
- `src/styles.css` — estilos responsive sin frameworks
- `src/data/domains.ts` — 4 dominios, objetivos y 12 lecciones
- `src/data/questions.ts` — 32 preguntas originales (8 por dominio)
- `src/lib/quiz.ts` — lógica de sesión y puntuación
- `src/lib/storage.ts` — persistencia segura en localStorage
- `tests/` — Vitest: contenido, quiz y persistencia
