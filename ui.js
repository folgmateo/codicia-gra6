// Interfaz: diálogos, paneles, menús, HUD, tarjetas, notificaciones, audio y ajustes.

const DLG = { open: false, onAdv: null, typing: false, timer: null, full: '', choiceOpen: false, pickFn: null, n: 0 };
const PANEL = { open: false, locked: false, onClose: null };
const CARD = { busy: false };
const SPEAKER_LOOK = { 'Tú': 'tu', 'Coleta Cris': 'coleta', 'Juan José': 'juan', 'Alicia Juana': 'alicia', 'Teo Ixcol': 'teo', 'Recursos Humanos': 'rrhh', 'Consejero Rovira': 'consejo' };
const STAT_ROWS = [
  ['CAOS', 'chaos', '#e74c3c'],
  ['CONSEJO', 'board', '#3498db'],
  ['INVERSORES', 'investors', '#f1c40f'],
  ['REPUTACIÓN', 'public', '#2ecc71'],
  ['INVESTIGACIÓN', 'investigation', '#9b59b6']
];

function $(id) { return document.getElementById(id); }
function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}
function mkBtn(label, fn, cls) {
  const b = el('button', cls || 'btn', label);
  b.onclick = fn;
  return b;
}
function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
function isBusy() { return DLG.open || PANEL.open || CARD.busy; }

// ---------- Diálogos ----------
function runDialog(items, done) {
  DLG.open = true;
  $('dialog').classList.remove('hidden');
  runScript(items, () => { closeDialog(); if (done) done(); });
}

function runScript(items, done) {
  let i = 0;
  const step = () => {
    while (i < items.length) {
      const it = items[i++];
      if (typeof it === 'function') { it(); continue; }
      if (Array.isArray(it)) { showLine(it[0], it[1], step); return; }
      if (it && it.choices) {
        showChoices(it.choices.map(c => c[0]), idx => runScript(it.choices[idx][1], step));
        return;
      }
    }
    done();
  };
  step();
}

function showLine(who, text, cb) {
  setPortrait(who);
  $('speaker').textContent = who;
  $('choices').innerHTML = '';
  $('next').classList.add('hidden');
  DLG.onAdv = cb;
  typeText(text);
}

function typeText(text) {
  clearInterval(DLG.timer);
  const out = $('text');
  out.textContent = '';
  DLG.full = text;
  DLG.typing = true;
  let i = 0;
  DLG.timer = setInterval(() => {
    i += META.settings.speed;
    out.textContent = text.slice(0, i);
    if (i >= text.length) finishTyping();
  }, 24);
}

function finishTyping() {
  clearInterval(DLG.timer);
  DLG.typing = false;
  $('text').textContent = DLG.full;
  $('next').classList.remove('hidden');
}

function showChoices(labels, pick) {
  DLG.choiceOpen = true;
  DLG.onAdv = null;
  DLG.pickFn = pick;
  DLG.n = labels.length;
  $('next').classList.add('hidden');
  const box = $('choices');
  box.innerHTML = '';
  labels.forEach((label, idx) => {
    const b = el('button', 'choice', (idx + 1) + '. ' + label);
    b.onclick = ev => { ev.stopPropagation(); pickChoice(idx); };
    box.appendChild(b);
  });
}

function pickChoice(i) {
  if (!DLG.choiceOpen || i >= DLG.n) return;
  DLG.choiceOpen = false;
  $('choices').innerHTML = '';
  DLG.pickFn(i);
}

function advance() {
  if (!DLG.open || DLG.choiceOpen) return;
  if (DLG.typing) return finishTyping();
  const cb = DLG.onAdv;
  DLG.onAdv = null;
  if (cb) cb();
}

function closeDialog() {
  DLG.open = false;
  clearInterval(DLG.timer);
  DLG.typing = false;
  DLG.onAdv = null;
  DLG.choiceOpen = false;
  $('dialog').classList.add('hidden');
}

function setPortrait(who) {
  const c = $('portrait').getContext('2d');
  c.fillStyle = '#1b2030';
  c.fillRect(0, 0, 24, 24);
  const look = SPEAKER_LOOK[who];
  if (look) drawPerson(c, 0, 0, LOOKS[look], 0, 1);
  else drawIcon(c, 'pc', 12, 12);
}

// ---------- Tarjetas, transiciones, notificaciones ----------
function showCard(title, sub, cb, ms) {
  CARD.busy = true;
  $('card-title').textContent = title;
  $('card-sub').textContent = sub || '';
  const c = $('card');
  c.classList.remove('hidden');
  requestAnimationFrame(() => c.classList.add('show'));
  setTimeout(() => {
    c.classList.remove('show');
    setTimeout(() => {
      c.classList.add('hidden');
      CARD.busy = false;
      if (cb) cb();
    }, 600);
  }, ms || 2600);
}

function fadeTo(fn) {
  CARD.busy = true;
  const f = $('fade');
  f.classList.add('on');
  setTimeout(() => {
    CARD.busy = false; // antes de fn: fn puede abrir otra tarjeta
    fn();
    setTimeout(() => f.classList.remove('on'), 80);
  }, 600);
}

function toast(text, kind) {
  const t = el('div', 'toast' + (kind ? ' ' + kind : ''), text);
  $('toasts').appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

// ---------- Paneles ----------
function openPanel(title, content, opts) {
  opts = opts || {};
  PANEL.open = true;
  PANEL.locked = !!opts.locked;
  PANEL.onClose = opts.onClose || null;
  $('panel-title').textContent = title;
  const body = $('panel-body');
  body.innerHTML = '';
  if (typeof content === 'string') body.appendChild(el('p', 'pt', content));
  else if (content) (Array.isArray(content) ? content : [content]).forEach(n => body.appendChild(n));
  $('panel-close').classList.toggle('hidden', PANEL.locked);
  $('panel').classList.remove('hidden');
  if (opts.init) opts.init(body);
}

function closePanel() {
  if (PANEL.locked || !PANEL.open) return;
  forcePanelClose();
}

function forcePanelClose() {
  const was = PANEL.onClose;
  PANEL.open = false;
  PANEL.locked = false;
  PANEL.onClose = null;
  $('panel').classList.add('hidden');
  if (was) was();
}

// ---------- Menús ----------
function showMenu() {
  mode = 'menu';
  forcePanelClose();
  DLG.open = false;
  $('dialog').classList.add('hidden');
  $('hud').classList.add('hidden');
  $('menu').classList.remove('hidden');
  const sv = readSave();
  const items = [
    ['NUEVA PARTIDA', newGame, false],
    ['CONTINUAR', continueGame, !sv],
    ['SELECCIONAR CAPÍTULO', chapterSelect, !META.maxCh],
    ['GALERÍA', gallery, false],
    ['LOGROS', achievementsPanel, false],
    ['AYUDA', helpPanel, false],
    ['CRÉDITOS', () => creditsPanel(false), false],
    ['CONFIGURACIÓN', settingsPanel, false]
  ];
  const box = $('menu-buttons');
  box.innerHTML = '';
  items.forEach(([label, fn, dis]) => {
    const b = mkBtn(label, fn);
    b.disabled = dis;
    box.appendChild(b);
  });
  tickCountdowns();
}

function chapterSelect() {
  const nodes = CHAPTERS.slice(0, (META.maxCh || 0) + 1).map((c, i) =>
    mkBtn((i + 1) + '. ' + c.title, () => { S = newState(); S.chapter = i; startChapter(i, false); }));
  openPanel('SELECCIONAR CAPÍTULO', nodes);
}

function gallery() {
  const nodes = Object.keys(ENDINGS).map(k => el('div', 'ach-row' + (META.endings[k] ? ' on' : ''),
    META.endings[k] ? ENDINGS[k].title + ' — ' + ENDINGS[k].text : '???'));
  openPanel('GALERÍA DE FINALES', nodes);
}

function achievementsPanel() {
  const nodes = Object.keys(ACHIEVEMENTS).map(id => {
    const on = !!META.achievements[id];
    return el('div', 'ach-row' + (on ? ' on' : ''), (on ? '[✓] ' + ACHIEVEMENTS[id].name + ' — ' + ACHIEVEMENTS[id].d : '[ ] ???'));
  });
  openPanel('LOGROS', nodes);
}

function creditsPanel(end) {
  const txt = 'CODICIA: OPERACIÓN GRA (6)\n\nTodos los personajes son ficticios.\nHecho con HTML5, CSS3 y JavaScript vanilla.\n\nGuion, pixel art y minijuegos: un estudio indie imaginario.\n\nLa investigación continúa.';
  openPanel('CRÉDITOS', [el('p', 'pt', txt), mkBtn('Volver', () => forcePanelClose())], { onClose: end ? showMenu : null });
}

function settingsPanel() {
  const s = META.settings;
  const vol = el('input');
  vol.type = 'range'; vol.min = 0; vol.max = 1; vol.step = 0.05; vol.value = s.vol;
  vol.oninput = () => { s.vol = Number(vol.value); if (MASTER) MASTER.gain.value = s.vol; saveMeta(); };
  const mus = mkBtn(s.music ? 'Música: sí' : 'Música: no', () => {
    s.music = !s.music;
    mus.textContent = s.music ? 'Música: sí' : 'Música: no';
    setMusic(s.music);
    saveMeta();
  });
  const fx = mkBtn(s.fx ? 'Efectos: sí' : 'Efectos: no', () => {
    s.fx = !s.fx;
    fx.textContent = s.fx ? 'Efectos: sí' : 'Efectos: no';
    saveMeta();
  });
  const spd = el('select');
  ['Lenta', 'Normal', 'Rápida', 'Muy rápida'].forEach((label, i) => {
    const o = el('option', '', label);
    o.value = i + 1;
    spd.appendChild(o);
  });
  spd.value = s.speed;
  spd.onchange = () => { s.speed = Number(spd.value); saveMeta(); };
  const full = mkBtn('Pantalla completa', () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen();
  });
  const row = (label, node) => { const r = el('div', 'frow'); r.appendChild(el('span', '', label)); r.appendChild(node); return r; };
  openPanel('CONFIGURACIÓN', [row('Volumen', vol), mus, fx, row('Velocidad del diálogo', spd), full]);
}

function inventoryPanel() {
  if (!S) return;
  const nodes = S.inv.length
    ? S.inv.map(i => el('div', 'ach-row on', i.name + ' — ' + i.desc))
    : [el('p', 'pt', 'Vacío.')];
  openPanel('INVENTARIO', nodes);
}

function missionsPanel() {
  if (!S || !CH) return;
  const nodes = CH.tasks.map(t => el('div', 'ach-row' + (S.done[t.id] ? ' on' : ''), (S.done[t.id] ? '[✓] ' : '[ ] ') + t.text));
  nodes.unshift(el('p', 'pt', 'PREGUNTA: ' + QUESTIONS[S.chapter]));
  openPanel('MISIONES', nodes);
}

function helpPanel() {
  const txt = 'CONTROLES\n' +
    'WASD o flechas: moverse.\n' +
    'E, espacio o Enter: interactuar, avanzar el diálogo.\n' +
    '1 a 4: elegir una opción.\n' +
    'I: inventario · J: misiones · C: caso (pistas) · ESC: pausa.\n' +
    'En móvil, usa los botones de la pantalla.\n\n' +
    'CÓMO JUGAR\n' +
    'Acércate a un objeto o persona. Aparece una «E»: púlsala para interactuar.\n' +
    'Las misiones del capítulo están en J. Completa todas para avanzar.\n' +
    'Cada acción gasta minutos del reloj del capítulo. Si se acaba, la vigilancia sube.\n' +
    'Las pistas van al CASO (C). Al final, señala al filtrador ante el comité.\n' +
    'Las pruebas suben la investigación. El caos sube con tus decisiones y con los sucesos.\n' +
    'Si pierdes un minijuego, puedes reintentarlo o salir.\n\n' +
    'MINIJUEGOS\n' +
    'Auditoría, archivos, contraseña, audiencia, crisis, ventanas emergentes y bandeja de correo.\n\n' +
    'CONSEJO\n' +
    'Algunas respuestas cambian el final. Revisa todo lo que encuentres.';
  openPanel('AYUDA', [el('p', 'pt', txt)]);
}

function pausePanel() {
  openPanel('PAUSA', [
    mkBtn('Continuar', closePanel),
    mkBtn('Inventario', inventoryPanel),
    mkBtn('Misiones', missionsPanel),
    mkBtn('Caso', caseBoard),
    mkBtn('Línea del tiempo', timelinePanel),
    mkBtn('Ayuda', helpPanel),
    mkBtn('Configuración', settingsPanel),
    mkBtn('Guardar y salir al menú', () => { saveGame(); showMenu(); })
  ]);
}

// Tablero del caso: pistas agrupadas por sospechoso, y cruce de pistas para revelar contradicciones.
let CROSS_SEL = [];
function caseBoard() {
  if (!S) return;
  const SUSP = ['Coleta Cris', 'Alicia Juana', 'Teo Ixcol', 'Consejero Rovira', 'Recursos Humanos'];
  const clues = S.clues || [];
  const nodes = SUSP.map(name => {
    const list = clues.filter(c => c.suspect === name);
    const box = el('div', 'ach-row' + (list.length ? ' on' : ''), name + ' — ' + (list.length ? list.length + ' pista(s)' : 'sin pistas'));
    list.forEach(c => box.appendChild(el('div', 'pt', '· ' + (c.date ? '[' + c.date + '] ' : '') + c.text)));
    return box;
  });
  const pool = clues.filter(c => !CROSS.some(x => x.id === c.id));
  nodes.push(el('p', 'pt', pool.length >= 2 ? 'CRUZAR PISTAS: elige dos que se contradigan o se completen.' : 'CRUZAR PISTAS: consigue más pistas para cruzarlas.'));
  const row = el('div', 'mg-row');
  pool.forEach(c => {
    const on = CROSS_SEL.includes(c.id);
    row.appendChild(mkBtn((on ? '✔ ' : '') + c.text.slice(0, 34) + '…', () => {
      CROSS_SEL = on ? CROSS_SEL.filter(x => x !== c.id) : CROSS_SEL.concat(c.id).slice(-2);
      if (CROSS_SEL.length === 2) tryCross(CROSS_SEL[0], CROSS_SEL[1]);
      caseBoard();
    }, 'tile'));
  });
  nodes.push(row);
  openPanel('CASO: ¿QUIÉN FILTRÓ LAS ACTAS?', nodes);
}

function tryCross(a, b) {
  CROSS_SEL = [];
  const x = CROSS.find(p => (p.a === a && p.b === b) || (p.a === b && p.b === a));
  if (!x) return toast('Esas pistas no se contradicen.');
  if (S.clues.some(c => c.id === x.id)) return toast('Ya cruzaste esas pistas.');
  G.clue(x.id, x.text, x.suspect);
}

// Línea del tiempo: los hechos aparecen cuando encuentras la pista que los revela.
function timelinePanel() {
  if (!S) return;
  const nodes = TIMELINE.map(ev => {
    const found = !ev.c || S.clues.some(c => c.id === ev.c);
    return el('div', 'ach-row' + (found ? ' on' : ''), ev.d + ' — ' + (found ? ev.t : '???'));
  });
  openPanel('LÍNEA DEL TIEMPO', nodes);
}

// ---------- HUD y contadores ----------
function updateHud() {
  if (!S || !CH) return;
  $('hud-chapter').textContent = 'CAP. ' + (S.chapter + 1) + ' · ' + CH.title;
  const box = $('hud-stats');
  box.innerHTML = '';
  STAT_ROWS.forEach(([lab, key, col]) => {
    const row = el('div', 'srow');
    row.appendChild(el('span', 'slab', lab));
    const bar = el('div', 'sbar');
    const f = el('div', 'sfill');
    f.style.width = S.stats[key] + '%';
    f.style.background = col;
    bar.appendChild(f);
    row.appendChild(bar);
    box.appendChild(row);
  });
  const pend = CH.tasks.find(t => !S.done[t.id]);
  $('hud-task').textContent = pend ? 'Misión: ' + pend.text : 'Misiones completadas';
  $('hud-clock').textContent = 'RELOJ: ' + S.clock + ' min';
  $('hud-clock').classList.toggle('late', S.clock <= 3);
  $('cd-hud').classList.toggle('faint', S.chapter < 2);
}

function revealedInSave() {
  const sv = readSave();
  return !!(sv && sv.flags && sv.flags.revealed);
}

function tickCountdowns() {
  const parts = countdownParts(Date.now(), CONFIG.LAUNCH_DATE);
  const revealed = S ? !!S.flags.revealed : revealedInSave();
  document.querySelectorAll('.cd').forEach(elm => {
    elm.querySelector('.cd-l').textContent = revealed ? 'LANZAMIENTO DE GRA (6)' : 'PRÓXIMO EVENTO CORPORATIVO';
    elm.querySelector('.cd-t').textContent = countdownText(parts);
    elm.classList.toggle('revealed', revealed);
  });
}

function pickNews() {
  const pool = NEWS_BASE.slice();
  if (S && S.stats.chaos >= 40) pool.push(...NEWS_HIGH);
  if (S && S.stats.chaos >= 70) pool.push(...NEWS_SAT);
  return pool[Math.floor(Math.random() * pool.length)];
}

// ---------- Audio (WebAudio sintetizado; sin archivos externos) ----------
let AC = null, MASTER = null, DRONE = null;

function audioInit() {
  if (AC) return;
  try {
    AC = new (window.AudioContext || window.webkitAudioContext)();
    MASTER = AC.createGain();
    MASTER.gain.value = META.settings.vol;
    MASTER.connect(AC.destination);
    setMusic(META.settings.music);
  } catch (e) { AC = null; }
}

function beep(freq, dur, delay) {
  if (!AC || !META.settings.fx) return;
  const t = AC.currentTime + (delay || 0);
  const o = AC.createOscillator(), g = AC.createGain();
  o.type = 'square';
  o.frequency.value = freq;
  g.gain.setValueAtTime(0.15, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  o.connect(g);
  g.connect(MASTER);
  o.start(t);
  o.stop(t + dur);
}

function setMusic(on) {
  if (!AC) return;
  if (on && !DRONE) {
    DRONE = AC.createGain();
    DRONE.gain.value = 0.03;
    DRONE.connect(MASTER);
    [55, 82.4].forEach(f => {
      const o = AC.createOscillator();
      o.type = 'sine';
      o.frequency.value = f;
      o.connect(DRONE);
      o.start();
    });
  }
  if (DRONE) DRONE.gain.value = on ? 0.03 : 0;
}
