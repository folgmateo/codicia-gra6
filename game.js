// Motor: estado de partida, mapa, jugador, render, entrada, flujo de capítulos y API G.

const TILE = 24, VW = 480, VH = 264, COLS = 20, ROWS = 11;
const BLOCKED = '#DPSWR';
const cv = document.getElementById('game');
const ctx = cv.getContext('2d');
ctx.imageSmoothingEnabled = false;

const LOOKS = {
  tu: { skin: '#e8b58a', hair: '#3b2a1a', shirt: '#3c6fd1', pants: '#222838' },
  juan: { skin: '#e0a57c', hair: '#1b1b1b', shirt: '#f4f4f4', pants: '#2a2a33', tie: '#c0392b', glasses: 1 },
  coleta: { skin: '#f0c4a0', hair: '#c45b2c', shirt: '#2c2c44', pants: '#1a1a25', bun: 1 },
  alicia: { skin: '#d9a56f', hair: '#0f0f0f', shirt: '#8e44ad', pants: '#333', long: 1 },
  teo: { skin: '#b7835a', hair: '#222', shirt: '#34495e', pants: '#1f2a36', glasses: 1 },
  rrhh: { skin: '#f3cfb0', hair: '#7f8c8d', shirt: '#16a085', pants: '#2c3e50', long: 1 },
  consejo: { skin: '#e5b499', hair: '#bdc3c7', shirt: '#1f2d3d', pants: '#111', tie: '#2980b9' }
};

let S = null;               // partida actual (null en el menú)
let META = loadMeta();      // logros, finales, ajustes
let mode = 'menu';          // 'menu' | 'play' | 'finale'
let CH = null, MAP = [], PAINT = null, OBJS = [], NPCS = [];
let nearest = null, pendingEnd = false, flashT = 0, motes = [], demoT = 0;
const P = { x: 0, y: 0, dir: 1, step: 0 };
const HELD = {};
const MOVE = { arrowleft: [-1, 0], a: [-1, 0], arrowright: [1, 0], d: [1, 0], arrowup: [0, -1], w: [0, -1], arrowdown: [0, 1], s: [0, 1] };

// ---------- Guardado ----------
function loadMeta() {
  let m = {};
  try { m = JSON.parse(localStorage.getItem(CONFIG.META_KEY)) || {}; } catch (e) { m = {}; }
  const settings = Object.assign({ vol: 0.6, music: true, fx: true, speed: 2 }, m.settings || {});
  return Object.assign({ achievements: {}, endings: {}, maxCh: 0 }, m, { settings });
}
function saveMeta() { try { localStorage.setItem(CONFIG.META_KEY, JSON.stringify(META)); } catch (e) { /* almacenamiento no disponible */ } }
function newState() {
  return {
    chapter: 0, flags: {}, done: {}, inv: [], gaming: [], evidence: 0, cover: false, hr: false, clues: [], clock: 0,
    stats: { chaos: 0, board: 70, investors: 70, public: 60, investigation: 0 }
  };
}
function saveGame() { try { localStorage.setItem(CONFIG.SAVE_KEY, JSON.stringify(S)); } catch (e) { /* sin almacenamiento */ } }
function readSave() { try { return JSON.parse(localStorage.getItem(CONFIG.SAVE_KEY)); } catch (e) { return null; } }

// ---------- API G (la usan las acciones de story.js) ----------
const G = {
  say: (items, done) => runDialog(items, done),
  task(id) {
    if (S.done[id]) return;
    S.done[id] = true;
    saveGame();
    const t = CH.tasks.find(x => x.id === id);
    toast('Misión completada: ' + (t ? t.text : id));
    if (CH.tasks.every(x => S.done[x.id])) pendingEnd = true;
    updateHud();
  },
  item(name, desc, gaming) {
    if (!S.inv.some(i => i.name === name)) S.inv.push({ name, desc });
    if (gaming && !S.gaming.includes(name)) S.gaming.push(name);
    saveGame();
    toast('Objeto: ' + name);
    if (S.gaming.length >= 3) G.achieve('gamer');
  },
  flag(k) { S.flags[k] = true; saveGame(); },
  stat(k, d) {
    const before = S.stats[k];
    S.stats[k] = clamp(before + d, 0, 100);
    saveGame();
    updateHud();
    if (k === 'chaos' && d > 0) {
      toast('Caos corporativo +' + d);
      // Avisos al cruzar un umbral hacia arriba.
      if (before < 50 && S.stats.chaos >= 50) toast('ALERTA: el caos supera el 50%', 'ach');
      if (before < 80 && S.stats.chaos >= 80) toast('ALERTA CRÍTICA: Codicia pierde el control', 'ach');
    }
  },
  evidence(n) {
    S.evidence += n;
    S.stats.investigation = clamp(S.stats.investigation + 20 * n, 0, 100);
    saveGame();
    updateHud();
    toast('Prueba registrada');
  },
  achieve(id) {
    if (META.achievements[id]) return;
    META.achievements[id] = true;
    saveMeta();
    toast('LOGRO: ' + ACHIEVEMENTS[id].name, 'ach');
    beep(880, 0.2, 0);
    beep(1175, 0.25, 0.15);
  },
  minigame(name, opts, cb) { spend(2); startMinigame(name, opts, cb); },
  clue(id, text, suspect) {
    if (S.clues.some(c => c.id === id)) return;
    S.clues.push({ id, text, suspect, date: CLUE_DATES[id] || '' });
    saveGame();
    toast('Pista: ' + suspect, 'ach');
  },
  card(title, sub, cb, ms) { showCard(title, sub, cb, ms || 4200); },
  news(text) { $('ticker').textContent = text; },
  reveal() {
    S.flags.revealed = true;
    saveGame();
    flashT = 1.5;
    beep(523, 0.15, 0); beep(659, 0.15, 0.15); beep(784, 0.3, 0.3);
    toast('NOTIFICACIÓN: LANZAMIENTO DE GRA (6)', 'ach');
    tickCountdowns();
  }
};

// Cada acción gasta minutos del reloj del capítulo. Al agotarse, la vigilancia sube una vez.
function spend(min) {
  if (!S) return;
  const was = S.clock;
  S.clock = Math.max(0, S.clock - min);
  if (was > 0 && S.clock === 0) {
    G.stat('chaos', 5);
    toast('SE ACABÓ EL TIEMPO: los guardias cierran la planta.', 'ach');
  }
  saveGame();
  updateHud();
}

// ---------- Mapa y pintura ----------
function paintMap(M) {
  const g = document.createElement('canvas');
  g.width = VW; g.height = VH;
  const c = g.getContext('2d');
  for (let r = 0; r < ROWS; r++) for (let col = 0; col < COLS; col++) {
    const ch = M[r][col], x = col * TILE, y = r * TILE, alt = (col + r) % 2 === 0;
    const R = (fill, a, b, w, h) => { c.fillStyle = fill; c.fillRect(x + a, y + b, w, h); };
    if (ch === '#') { R('#11151f', 0, 0, TILE, TILE); R('#2b3550', 0, 0, TILE, 3); R('#1a2030', 0, 20, TILE, 4); continue; }
    R(alt ? '#2a2f3d' : '#2e3446', 0, 0, TILE, TILE);
    if (ch === '.') continue;
    if (ch === 'C') { R(alt ? '#4a2f5e' : '#43295a', 0, 0, TILE, TILE); R('#5b3e72', 4, 4, 2, 2); R('#5b3e72', 16, 14, 2, 2); }
    else if (ch === 'D') { R('#6b4f2e', 1, 7, TILE - 2, TILE - 9); R('#8a6a40', 1, 7, TILE - 2, 3); R('#1b1d24', 9, 2, 6, 5); R('#39ff88', 10, 3, 4, 3); }
    else if (ch === 'P') { R('#6b3f22', 7, 15, 10, 8); R('#2e8b57', 4, 4, 16, 12); R('#3cb371', 6, 2, 12, 6); }
    else if (ch === 'S') { R('#7a2e3a', 1, 6, TILE - 2, TILE - 8); R('#9b3d4d', 3, 8, TILE - 6, TILE - 12); }
    else if (ch === 'R') { R('#0c0f18', 2, 0, TILE - 4, TILE); for (let k = 0; k < 5; k++) R(k % 2 ? '#ff4d4d' : '#4dff88', 5, 3 + k * 4, 2, 2); }
    else if (ch === 'W') { R('#1d4a6b', 0, 0, TILE, TILE); R('#8fd3ff', 3, 3, TILE - 6, TILE - 6); R('#d8f3ff', 6, 5, 2, TILE - 10); }
  }
  return g;
}

function loadVisual(i) {
  CH = CHAPTERS[i];
  MAP = CH.map.map(r => (r + '#'.repeat(COLS)).slice(0, COLS));
  while (MAP.length < ROWS) MAP.push('#'.repeat(COLS));
  MAP = MAP.slice(0, ROWS);
  PAINT = paintMap(MAP);
  OBJS = CH.objects;
  NPCS = CH.npcs;
  P.x = CH.start[0] * TILE; P.y = CH.start[1] * TILE; P.dir = 1; P.step = 0;
  motes = Array.from({ length: 24 }, () => ({ x: Math.random() * VW, y: Math.random() * VH, v: 0.1 + Math.random() * 0.25 }));
  nearest = null;
}

function loadChapter(i) {
  loadVisual(i);
  S.chapter = i;
  S.clues = S.clues || [];
  S.clock = CH.time || 18;
  META.maxCh = Math.max(META.maxCh || 0, i);
  saveMeta();
  saveGame();
  if (CH.tasks.every(t => S.done[t.id])) pendingEnd = true;
  updateHud();
}

function startChapter(i, skipIntro) {
  forcePanelClose();
  $('menu').classList.add('hidden');
  mode = 'play';
  fadeTo(() => {
    loadChapter(i);
    $('hud').classList.remove('hidden');
    if (skipIntro) return;
    showCard(CH.title, CH.sub, () => runDialog(CH.intro));
  });
}

// ---------- Colisiones y movimiento ----------
function tileAt(c, r) { return (c < 0 || r < 0 || c >= COLS || r >= ROWS) ? '#' : MAP[r][c]; }
function solid(px, py) { return BLOCKED.includes(tileAt(Math.floor(px / TILE), Math.floor(py / TILE))); }
function boxFree(x, y) {
  const bx = x + 5, by = y + 14, bw = 14, bh = 9;
  return !(solid(bx, by) || solid(bx + bw - 1, by) || solid(bx, by + bh - 1) || solid(bx + bw - 1, by + bh - 1));
}
function visible(e) { return !e.when || (S && !!S.flags[e.when]); }

function updateNearest() {
  nearest = null;
  let best = 34;
  for (const e of OBJS.concat(NPCS)) {
    if (!visible(e)) continue;
    const d = Math.hypot(e.x * TILE + 12 - (P.x + 12), e.y * TILE + 12 - (P.y + 12));
    if (d < best) { best = d; nearest = e; }
  }
}

function interact() {
  if (!nearest || !S) return;
  const e = nearest;
  if (e.task && S.done[e.task] && !e.name) return runDialog([['Tú', 'Ya revisé esto. Nada nuevo.']]);
  spend(1);
  const act = ACTIONS[e.id];
  if (act) act();
  else runDialog([['Tú', 'Nada útil aquí.']]);
}

function update(dt) {
  if (mode === 'menu') {
    demoT += dt;
    P.x = (7 + 4 * Math.cos(demoT * 0.5)) * TILE - 12;
    P.y = (5 + 2 * Math.sin(demoT * 0.5)) * TILE - 12;
    P.dir = Math.cos(demoT * 0.5) >= 0 ? 1 : -1;
    P.step = demoT * 4;
  } else if (mode === 'play' && !isBusy()) {
    let dx = 0, dy = 0;
    for (const k in HELD) if (MOVE[k]) { dx += MOVE[k][0]; dy += MOVE[k][1]; }
    if (dx || dy) {
      const l = Math.hypot(dx, dy);
      dx /= l; dy /= l;
      if (dx) P.dir = dx > 0 ? 1 : -1;
      const sp = 72 * dt;
      const nx = P.x + dx * sp; if (boxFree(nx, P.y)) P.x = nx;
      const ny = P.y + dy * sp; if (boxFree(P.x, ny)) P.y = ny;
      P.step += dt * 9;
    } else P.step = 0;
    updateNearest();
    if (pendingEnd) { pendingEnd = false; finishChapter(); }
  }
  for (const m of motes) {
    m.y -= m.v;
    m.x += Math.sin(m.y * 0.05) * 0.15;
    if (m.y < 0) { m.y = VH; m.x = Math.random() * VW; }
  }
  if (flashT > 0) flashT -= dt;
}

// ---------- Dibujo ----------
function drawPerson(c, x, y, L, step, dir) {
  const ox = x + 4, oy = y + 1, s = step ? Math.round(Math.sin(step * 8)) : 0;
  c.fillStyle = L.pants;
  c.fillRect(ox + 4, oy + 16, 3, 6 + s);
  c.fillRect(ox + 9, oy + 16, 3, 6 - s);
  if (L.long) { c.fillStyle = L.hair; c.fillRect(ox + 3, oy + 4, 10, 12); }
  c.fillStyle = L.shirt;
  c.fillRect(ox + 3, oy + 9, 10, 8);
  c.fillRect(ox + 1, oy + 9, 2, 7 - s);
  c.fillRect(ox + 13, oy + 9, 2, 7 + s);
  if (L.tie) { c.fillStyle = L.tie; c.fillRect(ox + 7, oy + 10, 2, 5); }
  c.fillStyle = L.skin;
  c.fillRect(ox + 4, oy + 1, 8, 8);
  c.fillStyle = L.hair;
  c.fillRect(ox + 4, oy, 8, 3);
  if (L.bun) c.fillRect(ox + 6, oy - 2, 4, 2);
  c.fillStyle = '#111';
  const ex = dir < 0 ? ox + 5 : ox + 7;
  c.fillRect(ex, oy + 5, 1, 1);
  c.fillRect(ex + 2, oy + 5, 1, 1);
  if (L.glasses) { c.fillStyle = '#222'; c.fillRect(ox + 4, oy + 4, 3, 1); c.fillRect(ox + 8, oy + 4, 3, 1); }
}

function drawIcon(c, k, cx, cy) {
  const x = Math.round(cx - 6), y = Math.round(cy - 6);
  const R = (col, a, b, w, h) => { c.fillStyle = col; c.fillRect(x + a, y + b, w, h); };
  switch (k) {
    case 'pc': R('#222', 0, 0, 12, 9); R('#39ff88', 1, 1, 10, 7); R('#222', 5, 9, 2, 2); R('#222', 3, 11, 6, 1); break;
    case 'doc': R('#f3f1e7', 2, 0, 9, 12); R('#999', 4, 3, 5, 1); R('#999', 4, 6, 5, 1); R('#999', 4, 9, 4, 1); break;
    case 'red': R('#f3f1e7', 2, 0, 9, 12); R('#e74c3c', 2, 0, 9, 2); R('#999', 4, 4, 5, 1); R('#999', 4, 7, 5, 1); break;
    case 'cal': R('#fff', 0, 1, 12, 11); R('#e74c3c', 0, 1, 12, 3); R('#e74c3c', 7, 6, 3, 3); R('#555', 2, 0, 1, 2); R('#555', 9, 0, 1, 2); break;
    case 'folder': R('#d4a72c', 0, 2, 12, 9); R('#e6bf4d', 0, 0, 6, 3); break;
    case 'mail': R('#fff', 0, 2, 12, 8); R('#aaa', 1, 3, 10, 1); R('#aaa', 5, 5, 2, 2); break;
    case 'lock': R('#bdc3c7', 3, 0, 6, 6); R('#1f2430', 4, 1, 4, 4); R('#7f8c8d', 1, 5, 10, 7); R('#f1c40f', 5, 7, 2, 3); break;
    case 'gamer': R('#8e44ad', 0, 3, 12, 6); R('#d7bde2', 3, 5, 2, 2); R('#d7bde2', 7, 5, 2, 2); break;
    case 'cup': R('#8d5a2b', 2, 3, 8, 8); R('#fff', 2, 3, 8, 2); R('#8d5a2b', 10, 5, 2, 3); break;
    case 'phone': R('#222', 3, 0, 6, 12); R('#5dade2', 4, 1, 4, 9); break;
    case 'pod': R('#555', 2, 4, 8, 8); R('#777', 2, 4, 8, 2); break;
    default: R('#fff', 2, 2, 8, 8);
  }
}

function render(now) {
  const t = now / 1000;
  ctx.clearRect(0, 0, VW, VH);
  if (!PAINT) { ctx.fillStyle = '#000'; ctx.fillRect(0, 0, VW, VH); return; }
  ctx.drawImage(PAINT, 0, 0);
  if (CH) { ctx.fillStyle = CH.tint; ctx.fillRect(0, 0, VW, VH); }
  for (const o of OBJS) if (visible(o)) drawIcon(ctx, o.k, o.x * TILE + 12, o.y * TILE + 12 + Math.sin(t * 3 + o.x) * 1.2);
  const who = [{ y: P.y, draw: () => drawPerson(ctx, P.x, P.y, LOOKS.tu, P.step, P.dir) }];
  for (const n of NPCS) if (visible(n)) who.push({ y: n.y * TILE, draw: () => drawPerson(ctx, n.x * TILE, n.y * TILE, LOOKS[n.look], 0, 1) });
  who.sort((a, b) => a.y - b.y).forEach(w => w.draw());
  if (nearest && mode === 'play') {
    const cx = nearest.x * TILE + 12, cy = nearest.y * TILE - 6;
    ctx.fillStyle = '#fff'; ctx.fillRect(cx - 6, cy - 6, 12, 11);
    ctx.fillStyle = '#000'; ctx.font = 'bold 9px monospace'; ctx.fillText('E', cx - 3, cy + 3);
  }
  const LR = (CH && CH.light) || 260; // radio de luz: en capítulos oscuros la linterna alumbra poco
  const g = ctx.createRadialGradient(P.x + 12, P.y + 12, LR * 0.2, P.x + 12, P.y + 12, LR);
  g.addColorStop(0, 'rgba(0,0,0,0)');
  g.addColorStop(1, LR < 260 ? 'rgba(2,2,8,0.97)' : 'rgba(4,4,12,0.7)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, VW, VH);
  if (LR < 260 && Math.random() < 0.004) { ctx.fillStyle = 'rgba(0,0,0,0.85)'; ctx.fillRect(0, 0, VW, VH); } // apagón breve
  ctx.fillStyle = 'rgba(255,240,200,0.4)';
  for (const m of motes) ctx.fillRect(m.x | 0, m.y | 0, 1, 1);
  if (flashT > 0) { ctx.fillStyle = 'rgba(255,220,80,' + Math.min(0.6, flashT * 0.4) + ')'; ctx.fillRect(0, 0, VW, VH); }
}

// ---------- Flujo: capítulos, final ----------
function finishChapter() {
  if (S.chapter >= CHAPTERS.length - 1) return finale();
  S.chapter++;
  saveGame();
  startChapter(S.chapter, false);
}

function endingKey() {
  const proofs = (S.clues || []).filter(c => c.suspect === 'Coleta Cris').length;
  return chooseEnding({ hr: !!S.hr, cover: !!S.cover, revealed: !!S.flags.revealed, chaos: S.stats.chaos, evidence: S.evidence, accuse: S.accuse, proofs });
}

function finale() {
  mode = 'finale';
  S.flags.final = true;
  saveGame();
  runDialog([
    ['Narrador', 'Una silla gamer. Tres monitores. Comida rápida. Juan José está sentado, tranquilo.'],
    ['Coleta Cris', '¿Todo esto fue planeado?'],
    ['Juan José', '¿Qué cosa?'],
    ['Coleta Cris', '¡La renuncia! ¡La investigación! ¡Los correos! ¡El Congreso!'],
    ['Juan José', 'Mira, Coleta... uno tiene prioridades.'],
    ['Coleta Cris', '¿Pusiste en riesgo una empresa multimillonaria por un videojuego?'],
    ['Juan José', 'No es un videojuego. Es un acontecimiento cultural.'],
    ['Coleta Cris', '¿Y Alicia Juana?'],
    ['Juan José', 'Buena persona. Jugamos en línea una vez.'],
    ['Coleta Cris', '¿Y Superspeed?'],
    ['Juan José', 'Tenían buen ping.'],
    ['Narrador', 'Coleta Cris se queda en silencio.'],
    () => { toast('GRA (6) YA ESTÁ DISPONIBLE', 'ach'); beep(988, 0.3, 0); beep(1319, 0.4, 0.2); },
    ['Juan José', 'Bueno, muchachos. Ha sido un placer trabajar con ustedes.'],
    ['Narrador', 'Se desconecta. Pantalla negra.']
  ], endGame);
}

function endGame() {
  const key = endingKey();
  const E = ENDINGS[key];
  META.endings[key] = true;
  if (key === 'ceo' || key === 'rrhh') G.achieve(key);
  saveMeta();
  try { localStorage.removeItem(CONFIG.SAVE_KEY); } catch (e) { /* ignorar */ }
  S = null;
  G.card('CODICIA: OPERACIÓN GRA (6)', 'MISIÓN CUMPLIDA.', () => G.card(E.title, E.text, () => postCredits(key), 7000));
}

function postCredits(key) {
  const items = [];
  if (key === 'rrhh') items.push(
    ['Recursos Humanos', 'Sabíamos lo del plan desde el principio. Alguien tenía que firmar las vacaciones.'],
    ['Recursos Humanos', 'Pusimos «sin preguntas» porque el formulario no tenía un campo para «por favor, no».']
  );
  items.push(
    ['Narrador', 'Juan José juega tranquilamente en su habitación. Comida rápida, bebidas energéticas y una computadora gamer.'],
    ['Sistema', 'CONGRESO DE ESTADOS UNIDOS: «Se solicita su comparecencia».'],
    ['Juan José', '¿Diciembre? Ah, perfecto. Ya terminé la campaña principal.'],
    ['Teo Ixcol', 'Juan José, necesitamos hablar.'],
    ['Juan José', '¿Tienes el juego?']
  );
  runDialog(items, () => G.card('La investigación continúa.', 'Créditos finales', () => creditsPanel(true), 4200));
}

// ---------- Partida nueva y continuar ----------
function newGame() {
  S = newState();
  saveGame();
  startChapter(0, false);
}

function continueGame() {
  const sv = readSave();
  if (!sv) return;
  S = sv;
  startChapter(sv.chapter, true);
}

// ---------- Bucle y arranque ----------
let lastT = performance.now();
function frame(now) {
  const dt = Math.min(0.05, (now - lastT) / 1000);
  lastT = now;
  update(dt);
  render(now);
  requestAnimationFrame(frame);
}

// Acciones de teclado y táctil. Un solo punto de entrada.
function action(k) {
  if (DLG.open) {
    if (k === 'e' || k === ' ' || k === 'enter') advance();
    else if (/^[1-9]$/.test(k)) pickChoice(Number(k) - 1);
    return;
  }
  if (PANEL.open) { if (k === 'escape') closePanel(); return; }
  if (mode !== 'play') return;
  if (k === 'e' || k === ' ' || k === 'enter') interact();
  else if (k === 'escape') pausePanel();
  else if (k === 'i') inventoryPanel();
  else if (k === 'j') missionsPanel();
  else if (k === 'c') caseBoard();
  else if (k === 't') timelinePanel();
}

window.addEventListener('keydown', e => {
  if (!e.key) return;
  const k = e.key.toLowerCase();
  audioInit();
  // Con un selector o un control deslizante enfocado, las flechas son suyas.
  if (e.target && (e.target.tagName === 'SELECT' || e.target.tagName === 'INPUT')) return;
  if (MOVE[k]) { HELD[k] = true; e.preventDefault(); return; }
  if (k === ' ') e.preventDefault();
  if (e.repeat) return;
  action(k);
});
window.addEventListener('keyup', e => { if (e.key) delete HELD[e.key.toLowerCase()]; });
window.addEventListener('pointerdown', audioInit, { once: true });

document.querySelectorAll('#touch [data-k]').forEach(b => {
  const k = b.dataset.k;
  b.addEventListener('pointerdown', ev => {
    ev.preventDefault();
    audioInit();
    if (MOVE[k]) HELD[k] = true; else action(k);
  });
  const up = () => { delete HELD[k]; };
  b.addEventListener('pointerup', up);
  b.addEventListener('pointerleave', up);
  b.addEventListener('pointercancel', up);
});

$('panel-close').onclick = closePanel;
$('dbox').onclick = () => advance();
if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) $('touch').classList.remove('hidden');

setInterval(tickCountdowns, 1000);
setInterval(() => { if (S && mode === 'play') $('ticker').textContent = pickNews(); }, 9000);
// Avisos de ambiente: a veces aparece uno aleatorio mientras juegas.
setInterval(() => {
  if (S && mode === 'play' && !isBusy() && Math.random() < 0.4) toast(EVENTS[Math.floor(Math.random() * EVENTS.length)]);
}, 45000);

loadVisual(0);
tickCountdowns();
showMenu();
requestAnimationFrame(frame);
