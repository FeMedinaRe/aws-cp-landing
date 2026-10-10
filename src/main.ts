import './styles.css';
import { DOMAINS } from './data/domains';
import { QUESTIONS } from './data/questions';
import {
  buildSession,
  answerCurrent,
  advanceSession,
  sessionScore,
  isFinished,
  isPassing,
  QUIZ_PASS_THRESHOLD,
  currentQuestion,
  type QuizSession,
} from './lib/quiz';
import {
  loadProgress,
  saveProgress,
  resetProgress,
  recordQuizResult,
  markLessonComplete,
  type Progress,
} from './lib/storage';

const view = document.getElementById('view') as HTMLElement;
const live = document.getElementById('live') as HTMLElement;
let progress: Progress = loadProgress(localStorage);
let activeSession: QuizSession | null = null;
let selectedOption: number | null = null;
let lastFeedback: { correct: boolean; explanation: string } | null = null;
let quizConfig = { domainId: 'mixed', limit: 8 };

function persist() {
  saveProgress(localStorage, progress);
}

function announce(msg: string) {
  live.textContent = '';
  requestAnimationFrame(() => {
    live.textContent = msg;
  });
}

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function domainById(id: string) {
  return DOMAINS.find((d) => d.id === id);
}

function domainLabel(id: string): string {
  if (id === 'mixed') return 'Mixto (todos los dominios)';
  const d = domainById(id);
  return d ? `Dominio ${d.id} · ${d.titleEs} (${d.weight} %)` : id;
}

function completedCount(domainId: string): { done: number; total: number } {
  const d = domainById(domainId);
  if (!d) return { done: 0, total: 0 };
  const total = d.lessons.length;
  const done = d.lessons.filter((l) => progress.completedLessons[l.id]).length;
  return { done, total };
}

function route(): string {
  return location.hash || '#/inicio';
}

function setNav() {
  const r = route();
  document.querySelectorAll('[data-nav]').forEach((a) => {
    const el = a as HTMLAnchorElement;
    const key = el.getAttribute('data-nav') ?? '';
    const active =
      (r.startsWith('#/inicio') && key === 'inicio') ||
      (r.startsWith('#/dominio') && key === 'dominios') ||
      (r.startsWith('#/dominios') && key === 'dominios') ||
      (r.startsWith('#/quiz') && key === 'quiz') ||
      (r.startsWith('#/progreso') && key === 'progreso') ||
      (r.startsWith('#/recursos') && key === 'recursos');
    if (active) el.setAttribute('aria-current', 'page');
    else el.removeAttribute('aria-current');
  });
}

function render() {
  setNav();
  const r = route();
  if (r.startsWith('#/dominio/')) {
    renderDomain(r.split('/')[2]);
  } else if (r.startsWith('#/dominios')) {
    renderDomains();
  } else if (r.startsWith('#/quiz')) {
    renderQuiz();
  } else if (r.startsWith('#/progreso')) {
    renderProgress();
  } else if (r.startsWith('#/recursos')) {
    renderResources();
  } else {
    renderHome();
  }
}

function renderHome() {
  const totalLessons = DOMAINS.reduce((n, d) => n + d.lessons.length, 0);
  const doneLessons = Object.keys(progress.completedLessons).length;
  view.innerHTML = `
    <section class="hero" aria-labelledby="t-hero">
      <h1 id="t-hero">AWS Certified Cloud Practitioner (CLF-C02) en español</h1>
      <p>Estudia los <strong>cuatro dominios oficiales</strong> con lecciones en español,
      ejemplos y un cuestionario de práctica con preguntas <strong>originales (no oficiales)</strong>.
      Tu avance se guarda en este navegador.</p>
      <ul class="weights" aria-label="Pesos oficiales del examen">
        ${DOMAINS.map((d) => `<li>Dominio ${d.id} · ${esc(d.titleEs)} <strong>${d.weight} %</strong></li>`).join('')}
      </ul>
      <p>
        <a class="btn" href="#/dominios">Empezar a estudiar</a>
        <a class="btn secondary" href="#/quiz">Practicar con el quiz</a>
      </p>
      <p class="quiz-meta">Lecciones completadas: ${doneLessons}/${totalLessons} · Preguntas disponibles: ${QUESTIONS.length} · Intentos registrados: ${progress.quizResults.length}</p>
    </section>
    <section aria-labelledby="t-dom">
      <h2 id="t-dom">Los cuatro dominios</h2>
      <div class="grid">
        ${DOMAINS.map(
          (d) => `
          <article class="card">
            <span class="peso">${d.weight} % del examen</span>
            <h3>Dominio ${d.id}: ${esc(d.titleEs)}</h3>
            <p class="quiz-meta">${esc(d.titleEn)}</p>
            <p>${esc(d.description)}</p>
            <a class="btn small" href="#/dominio/${d.id}">Ver lecciones y objetivos</a>
          </article>`,
        ).join('')}
      </div>
    </section>
    <section class="panel" aria-labelledby="t-como">
      <h2 id="t-como">Cómo usar esta guía</h2>
      <ol>
        <li>Estudia cada dominio en orden o según tu progreso.</li>
        <li>Marca las lecciones como completadas para ver tu avance.</li>
        <li>Practica por dominio o en modo mixto, una pregunta a la vez.</li>
        <li>Revisa tu progreso y repite el quiz hasta alcanzar al menos el 70 %.</li>
      </ol>
    </section>`;
}

function renderDomains() {
  view.innerHTML = `
    <h1>Dominios del examen</h1>
    <p>Pesos oficiales: <strong>24 %, 30 %, 34 % y 12 %</strong> (suman 100 %).</p>
    <div class="grid">
      ${DOMAINS.map(
        (d) => {
          const { done, total } = completedCount(d.id);
          return `
          <article class="card">
            <span class="peso">Dominio ${d.id} · ${d.weight} %</span>
            <h2>${esc(d.titleEs)}</h2>
            <p class="quiz-meta">${esc(d.titleEn)}</p>
            <p>${esc(d.description)}</p>
            <p class="quiz-meta">Lecciones: ${done}/${total} completadas</p>
            <p>
              <a class="btn small" href="#/dominio/${d.id}">Estudiar</a>
              <a class="btn small secondary" href="#/quiz?dominio=${d.id}">Quiz del dominio ${d.id}</a>
            </p>
          </article>`;
        },
      ).join('')}
    </div>`;
  bindQuizLinks();
}

function renderDomain(id: string) {
  const d = domainById(id);
  if (!d) {
    view.innerHTML = `<p>Dominio no encontrado. <a href="#/dominios">Volver</a></p>`;
    return;
  }
  view.innerHTML = `
    <p><a href="#/dominios">← Todos los dominios</a></p>
    <h1>Dominio ${d.id}: ${esc(d.titleEs)} (${d.weight} %)</h1>
    <p class="quiz-meta">${esc(d.titleEn)}</p>
    <p>${esc(d.description)}</p>
    <section class="panel" aria-labelledby="obj-${d.id}">
      <h2 id="obj-${d.id}">Objetivos del examen (resumen en español)</h2>
      <ul>
        ${d.objectives.map((o) => `<li>${esc(o)}</li>`).join('')}
      </ul>
    </section>
    <h2>Lecciones</h2>
    ${d.lessons
      .map(
        (l) => `
      <article class="lesson" aria-labelledby="t-${l.id}">
        <h3 id="t-${l.id}">${esc(l.title)}</h3>
        <p>${esc(l.body)}</p>
        <h4>Puntos clave</h4>
        <ul class="key-points">
          ${l.keyPoints.map((k) => `<li>${esc(k)}</li>`).join('')}
        </ul>
        ${l.example ? `<p class="example"><strong>Ejemplo:</strong> ${esc(l.example.replace(/^Ejemplo:\s*/, ''))}</p>` : ''}
        <p>
          ${
            progress.completedLessons[l.id]
              ? `<span role="status">✓ Completada</span>`
              : `<button class="btn small" data-complete="${l.id}">Marcar como completada</button>`
          }
        </p>
      </article>`,
      )
      .join('')}
    <p>
      <a class="btn" href="#/quiz?dominio=${d.id}">Hacer quiz del dominio ${d.id}</a>
      <a class="btn secondary" href="#/quiz?dominio=mixed">Quiz mixto</a>
    </p>`;
  view.querySelectorAll('[data-complete]').forEach((b) => {
    b.addEventListener('click', () => {
      const lid = (b as HTMLElement).getAttribute('data-complete')!;
      progress = markLessonComplete(progress, lid);
      persist();
      announce('Lección marcada como completada.');
      render();
    });
  });
  bindQuizLinks();
}

function bindQuizLinks() {
  view.querySelectorAll('a[href^="#/quiz?dominio="]').forEach((a) => {
    a.addEventListener('click', () => {
      const href = (a as HTMLAnchorElement).getAttribute('href')!;
      const m = href.match(/dominio=([a-z0-9]+)/);
      if (m) {
        quizConfig.domainId = m[1];
        activeSession = null;
        selectedOption = null;
        lastFeedback = null;
      }
    });
  });
}

// ---------- Quiz ----------

function parseQuizHash(): void {
  const m = location.hash.match(/dominio=([a-z0-9]+)/);
  if (m && ['1', '2', '3', '4', 'mixed'].includes(m[1])) {
    if (!activeSession) quizConfig.domainId = m[1];
  }
}

function renderQuiz() {
  parseQuizHash();
  if (!activeSession) {
    view.innerHTML = `
      <h1>Quiz de práctica</h1>
      <p class="notice" role="note"><strong>Banco original no oficial:</strong> preguntas creadas para estudiar.
      No son preguntas reales del examen ni predicen tu resultado oficial.</p>
      <section class="quiz-box quiz-options" aria-labelledby="cfg">
        <h2 id="cfg">Configurar intento</h2>
        <fieldset>
          <legend>Dominio</legend>
          ${[
            ['mixed', `Mixto · todos los dominios (${QUESTIONS.length} preguntas)`],
            ...DOMAINS.map(
              (d): [string, string] => [d.id, `Dominio ${d.id} · ${d.titleEs} (${d.weight} %)`],
            ),
          ]
            .map(
              ([v, label]) => `
            <label class="radio-row">
              <input type="radio" name="dominio" value="${v}" ${quizConfig.domainId === v ? 'checked' : ''} /> ${esc(label)}
            </label>`,
            )
            .join('')}
        </fieldset>
        <fieldset>
          <legend>Número de preguntas</legend>
          ${[5, 8, 10]
            .map(
              (n) => `
            <label class="radio-row">
              <input type="radio" name="limite" value="${n}" ${quizConfig.limit === n ? 'checked' : ''} /> ${n} preguntas
            </label>`,
            )
            .join('')}
        </fieldset>
        <p><button class="btn" id="start">Comenzar (una pregunta a la vez)</button></p>
      </section>
      ${progress.quizResults.length ? `<section class="panel"><h2>Últimos intentos</h2>${recentTable()}</section>` : ''}`;
    view.querySelector('#start')?.addEventListener('click', () => {
      const d = (view.querySelector('input[name="dominio"]:checked') as HTMLInputElement)?.value ?? 'mixed';
      const l = Number((view.querySelector('input[name="limite"]:checked') as HTMLInputElement)?.value ?? 8);
      quizConfig = { domainId: d, limit: l };
      const pool = QUESTIONS.filter((q) => d === 'mixed' || q.domainId === d);
      activeSession = buildSession(pool, { domainId: d, limit: Math.min(l, pool.length) });
      selectedOption = null;
      lastFeedback = null;
      announce(`Quiz iniciado: ${domainLabel(d)}, ${activeSession.questions.length} preguntas.`);
      render();
    });
    return;
  }

  if (isFinished(activeSession)) {
    renderQuizResult();
    return;
  }

  const q = currentQuestion(activeSession);
  const idx = activeSession.currentIndex;
  const total = activeSession.questions.length;
  const answered = activeSession.answers.length > activeSession.currentIndex;

  view.innerHTML = `
    <p><a href="#/quiz" id="salir">← Salir del quiz</a></p>
    <p class="notice" role="note"><strong>Pregunta de práctica no oficial</strong> · ${esc(domainLabel(q.domainId))}</p>
    <h1>Pregunta ${idx + 1} de ${total}</h1>
    <div class="progress-bar" role="progressbar" aria-valuenow="${idx}" aria-valuemin="0" aria-valuemax="${total}" aria-label="Avance del quiz">
      <span style="width:${Math.round((idx / total) * 100)}%"></span>
    </div>
    <section class="quiz-box" aria-labelledby="pq">
      <h2 id="pq">${esc(q.questionEs)}</h2>
      <form id="fquiz">
        <div role="radiogroup" aria-label="Opciones de respuesta">
          ${q.options
            .map(
              (op, i) => `
            <label class="opcion ${answered && i === q.correctIndex ? 'correcta' : ''} ${answered && selectedOption === i && i !== q.correctIndex ? 'incorrecta' : ''}">
              <input type="radio" name="op" value="${i}" ${selectedOption === i ? 'checked' : ''} ${answered ? 'disabled' : ''} />
              ${esc(op)}
            </label>`,
            )
            .join('')}
        </div>
        ${
          answered
            ? `<div class="feedback ${lastFeedback!.correct ? 'ok' : 'bad'}" role="status">
                 <p><strong>${lastFeedback!.correct ? '✓ Correcto' : '✗ Incorrecto'}</strong></p>
                 <p><strong>Explicación:</strong> ${esc(lastFeedback!.explanation)}</p>
               </div>
               <p><button class="btn" id="next">${idx + 1 === total ? 'Ver resultado' : 'Siguiente pregunta'}</button></p>`
            : `<p><button class="btn" id="check" ${selectedOption === null ? 'disabled' : ''}>Comprobar respuesta</button></p>`
        }
      </form>
      <p class="quiz-meta">Intento: ${domainLabel(activeSession.domainId)} · usa Tabulador y flechas para elegir, Intro para comprobar.</p>
    </section>`;

  view.querySelectorAll('input[name="op"]').forEach((r) => {
    r.addEventListener('change', () => {
      selectedOption = Number((r as HTMLInputElement).value);
      const btn = view.querySelector('#check') as HTMLButtonElement | null;
      if (btn) btn.disabled = false;
    });
  });
  view.querySelector('#check')?.addEventListener('click', (e) => {
    e.preventDefault();
    if (selectedOption === null) return;
    // Evita respuestas duplicadas (doble clic o reenvío).
    if (activeSession!.answers.length > activeSession!.currentIndex) return;
    const ok = answerCurrent(activeSession!, selectedOption);
    lastFeedback = { correct: ok, explanation: q.explanation };
    announce(ok ? 'Respuesta correcta.' : 'Respuesta incorrecta. Lee la explicación.');
    render();
    view.querySelector('#next')?.addEventListener && (view.querySelector('#next') as HTMLElement)?.focus();
  });
  view.querySelector('#next')?.addEventListener('click', (e) => {
    e.preventDefault();
    // Solo se avanza si la pregunta actual ya fue respondida.
    try {
      advanceSession(activeSession!);
    } catch {
      return;
    }
    selectedOption = null;
    lastFeedback = null;
    if (isFinished(activeSession!)) {
      // Persistencia única al avanzar más allá de la última pregunta.
      const s = sessionScore(activeSession!);
      progress = recordQuizResult(progress, {
        date: new Date().toISOString().slice(0, 10),
        domainId: activeSession!.domainId,
        correct: s.correct,
        total: s.total,
      });
      persist();
      announce(`Quiz terminado: ${s.correct} de ${s.total} (${s.percent} %).`);
    }
    render();
  });
  view.querySelector('#salir')?.addEventListener('click', () => {
    activeSession = null;
    selectedOption = null;
    lastFeedback = null;
  });
}

function renderQuizResult() {
  const s = sessionScore(activeSession!);
  const pass = isPassing(s.percent);
  view.innerHTML = `
    <h1>Resultado: ${s.correct}/${s.total} (${s.percent} %)</h1>
    <section class="panel" role="status" aria-label="Resultado del quiz">
      <p><strong>${pass ? '✓ Buen ritmo: sigue así.' : 'Hay margen de mejora: repasa y reintenta.'}</strong></p>
      <p>Dominio: ${esc(domainLabel(activeSession!.domainId))} · Umbral de práctica: ${QUIZ_PASS_THRESHOLD} %</p>
      <p class="quiz-meta">Preguntas de práctica originales y no oficiales; no equivalen al examen real.</p>
      <p>
        <button class="btn" id="retry">Reintentar</button>
        <a class="btn secondary" href="#/quiz" id="newq">Nuevo quiz</a>
        <a class="btn secondary" href="#/progreso">Ver progreso</a>
      </p>
    </section>
    <h2>Repaso de respuestas</h2>
    ${activeSession!.questions
      .map(
        (q, i) => `
      <article class="lesson">
        <h3>P${i + 1}: ${esc(q.questionEs)}</h3>
        <p>Tu respuesta: <strong>${esc(q.options[activeSession!.answers[i]] ?? '—')}</strong>
        ${activeSession!.answers[i] === q.correctIndex ? '✓' : `✗ (correcta: ${esc(q.options[q.correctIndex])})`}</p>
        <p><strong>Explicación:</strong> ${esc(q.explanation)}</p>
      </article>`,
      )
      .join('')}`;
  view.querySelector('#retry')?.addEventListener('click', () => {
    const d = activeSession!.domainId;
    const n = activeSession!.questions.length;
    const pool = QUESTIONS.filter((q) => d === 'mixed' || q.domainId === d);
    activeSession = buildSession(pool, { domainId: d, limit: n });
    selectedOption = null;
    lastFeedback = null;
    render();
  });
  view.querySelector('#newq')?.addEventListener('click', () => {
    activeSession = null;
    selectedOption = null;
    lastFeedback = null;
  });
}

function recentTable(): string {
  const last = [...progress.quizResults].slice(-8).reverse();
  return `
    <table>
      <thead><tr><th>Fecha</th><th>Dominio</th><th>Aciertos</th><th>%</th></tr></thead>
      <tbody>
        ${last.map((r) => `<tr><td>${esc(r.date)}</td><td>${esc(domainLabel(r.domainId))}</td><td>${r.correct}/${r.total}</td><td>${Math.round((r.correct / r.total) * 100)} %</td></tr>`).join('')}
      </tbody>
    </table>`;
}

function renderProgress() {
  const results = progress.quizResults;
  const byDomain = (id: string) => results.filter((r) => r.domainId === id || (id === 'mixed' && r.domainId === 'mixed'));
  view.innerHTML = `
    <h1>Tu progreso</h1>
    <p>Guardado localmente en este navegador (localStorage). Si el almacenamiento está dañado, se ignora de forma segura.</p>
    <h2>Lecciones por dominio</h2>
    <div class="grid">
      ${DOMAINS.map((d) => {
        const { done, total } = completedCount(d.id);
        const pct = total ? Math.round((done / total) * 100) : 0;
        return `
        <article class="card">
          <h3>Dominio ${d.id} · ${esc(d.titleEs)} (${d.weight} %)</h3>
          <div class="progress-bar" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100" aria-label="Lecciones del dominio ${d.id}">
            <span style="width:${pct}%"></span>
          </div>
          <p>${done}/${total} lecciones (${pct} %)</p>
          <p><a class="btn small secondary" href="#/dominio/${d.id}">Continuar</a></p>
        </article>`;
      }).join('')}
    </div>
    <h2>Intentos de quiz (${results.length})</h2>
    ${results.length ? recentTable() : '<p>Aún no hay intentos. <a href="#/quiz">Haz tu primer quiz</a>.</p>'}
    ${byDomain('mixed').length || results.length ? '' : ''}
    <p><button class="btn secondary" id="reset">Borrar todo mi progreso</button></p>`;
  view.querySelector('#reset')?.addEventListener('click', () => {
    if (confirm('¿Borrar lecciones completadas e historial de quiz?')) {
      progress = resetProgress(localStorage);
      announce('Progreso borrado.');
      render();
    }
  });
}

function renderResources() {
  view.innerHTML = `
    <h1>Recursos oficiales</h1>
    <section class="panel">
      <h2>Documentación de AWS (fuentes del temario)</h2>
      <ul>
        <li><a href="https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/cloud-practitioner-02.html" target="_blank" rel="noopener">Guía oficial del examen CLF-C02</a> — dominios, objetivos y pesos.</li>
        <li><a href="https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/clf-02-in-scope-services.html" target="_blank" rel="noopener">Servicios dentro del alcance del CLF-C02</a> — lista oficial de servicios evaluables.</li>
      </ul>
      <p class="quiz-meta">Los pesos usados en este sitio (24 %, 30 %, 34 %, 12 %) corresponden a la guía oficial vigente.</p>
    </section>
    <section class="panel">
      <h2>Aviso importante</h2>
      <p>Todo el contenido de lecciones y preguntas de este sitio es <strong>material de estudio independiente y no oficial</strong>.
      No contiene preguntas reales del examen. Para prepararte oficialmente usa la guía de AWS, Skill Builder y los ejemplos de examen de AWS.</p>
    </section>`;
}

window.addEventListener('hashchange', () => {
  render();
});

render();
