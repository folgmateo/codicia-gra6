// Pruebas de la lógica pura. Ejecutar con: node tests.js
const assert = require('assert');
const { mastermindScore } = require('./minigames.js');
const { chooseEnding, CHAPTERS, ACTIONS } = require('./story.js');
const { countdownParts, countdownText } = require('./config.js');

// Mastermind
assert.deepStrictEqual(mastermindScore([3, 1, 4], [3, 1, 4]), { exact: 3, partial: 0 });
assert.deepStrictEqual(mastermindScore([1, 3, 4], [3, 1, 4]), { exact: 1, partial: 2 });
assert.deepStrictEqual(mastermindScore([0, 0, 0], [3, 1, 4]), { exact: 0, partial: 0 });
assert.deepStrictEqual(mastermindScore([3, 3, 0], [3, 1, 4]), { exact: 1, partial: 0 });
assert.deepStrictEqual(mastermindScore([1, 1, 1], [1, 0, 0]), { exact: 1, partial: 0 });

// Finales
assert.strictEqual(chooseEnding({ hr: true, revealed: true, cover: false, chaos: 10, evidence: 3 }), 'rrhh');
assert.strictEqual(chooseEnding({ hr: false, revealed: true, cover: true, chaos: 10, evidence: 3 }), 'encubrimiento');
assert.strictEqual(chooseEnding({ hr: false, revealed: true, cover: false, chaos: 85, evidence: 3 }), 'imperio');
assert.strictEqual(chooseEnding({ hr: false, revealed: true, cover: false, chaos: 10, evidence: 1 }), 'orden');
assert.strictEqual(chooseEnding({ hr: false, revealed: true, cover: false, chaos: 10, evidence: 3 }), 'ceo');

assert.strictEqual(chooseEnding({ accuse: 'Coleta Cris', proofs: 2, chaos: 10, evidence: 0 }), 'verdad');
assert.strictEqual(chooseEnding({ accuse: 'Coleta Cris', proofs: 1, chaos: 10, evidence: 0 }), 'sinpruebas');
assert.strictEqual(chooseEnding({ accuse: 'Teo Ixcol', proofs: 3, chaos: 10, evidence: 0 }), 'falsa');
assert.strictEqual(chooseEnding({ accuse: 'Coleta Cris', proofs: 2, chaos: 85, evidence: 0 }), 'verdad');
assert.strictEqual(chooseEnding({ accuse: 'Teo Ixcol', proofs: 0, chaos: 85, evidence: 0 }), 'imperio');

// Caso: cada cruce usa pistas que existen en el juego, y cada hecho de la línea del tiempo tiene fecha si lo revela una pista.
const { TIMELINE, CROSS, QUESTIONS, CLUE_DATES } = require('./story.js');
assert.strictEqual(QUESTIONS.length, CHAPTERS.length, 'una pregunta guía por capítulo');
TIMELINE.forEach(ev => { if (ev.c) assert.ok(CLUE_DATES[ev.c], 'sin fecha para la pista ' + ev.c); });
CROSS.forEach(x => assert.ok(CLUE_DATES[x.id], 'sin fecha para el cruce ' + x.id));
assert.strictEqual(new Set(CROSS.map(x => x.id)).size, CROSS.length, 'ids de cruce únicos');

// Contador
const launch = '2026-12-18T00:00:00';
const now = new Date(launch).getTime() - (2 * 86400 + 3 * 3600 + 4 * 60 + 5) * 1000;
const p = countdownParts(now, launch);
assert.deepStrictEqual([p.days, p.hours, p.minutes, p.seconds], [2, 3, 4, 5]);
assert.strictEqual(countdownText(p), '2d 03:04:05');
assert.strictEqual(countdownText(countdownParts(Date.parse(launch) + 1, launch)), 'JUAN JOSÉ YA ESTÁ JUGANDO');

// Estructura: cada tarea de cada capítulo tiene un objeto o NPC con acción, y cada objeto con tarea existe en tareas.
CHAPTERS.forEach((ch, ci) => {
  assert.ok(ch.map.length === 11, 'capítulo ' + (ci + 1) + ': 11 filas');
  assert.ok(ch.intro && ch.intro.length > 0, 'capítulo ' + (ci + 1) + ': tiene intro');
  const ids = ch.objects.concat(ch.npcs).map(e => e.id);
  ids.forEach(id => assert.ok(ACTIONS[id], 'sin acción para ' + id));
  ch.objects.concat(ch.npcs).forEach(e => {
    if (e.task) assert.ok(ch.tasks.some(t => t.id === e.task), 'tarea ' + e.task + ' no declarada en capítulo ' + (ci + 1));
  });
});

// Mapas: 20 columnas, y todo objeto, PNJ y tarea debe ser alcanzable desde el inicio (BFS por casillas).
const BLOCKED = '#DPSWR';
CHAPTERS.forEach((ch, ci) => {
  const n = ci + 1;
  ch.map.forEach((r, y) => assert.strictEqual(r.length, 20, 'capítulo ' + n + ' fila ' + y + ': debe tener 20 columnas'));
  const open = (x, y) => y >= 0 && y < ch.map.length && x >= 0 && x < 20 && !BLOCKED.includes(ch.map[y][x]);
  assert.ok(open(ch.start[0], ch.start[1]), 'capítulo ' + n + ': inicio bloqueado');
  const seen = new Set([ch.start.join(',')]);
  const q = [ch.start];
  while (q.length) {
    const [x, y] = q.shift();
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx, ny = y + dy;
      if (open(nx, ny) && !seen.has(nx + ',' + ny)) { seen.add(nx + ',' + ny); q.push([nx, ny]); }
    }
  }
  ch.objects.concat(ch.npcs).forEach(e => {
    const near = [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]
      .some(([dx, dy]) => seen.has((e.x + dx) + ',' + (e.y + dy)));
    assert.ok(near, 'capítulo ' + n + ': inaccesible ' + e.id);
  });
});

console.log('Todas las pruebas pasaron.');
