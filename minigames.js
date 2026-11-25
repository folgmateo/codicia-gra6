// Cinco minijuegos. Cada uno llama a done({ win, ...extra }) al terminar.
// Usan la misma función alive(my) para ignorar temporizadores de una partida anterior.

let MG_RUN = 0, MG_TOKEN = 0;

function alive(my) { return my && my === MG_RUN; }

// Puntuación Mastermind: exact = dígito y posición correctos; partial = dígito bien en otra posición.
function mastermindScore(guess, code) {
  let exact = 0;
  const g = [], c = [];
  for (let i = 0; i < code.length; i++) {
    if (guess[i] === code[i]) exact++;
    else { g.push(guess[i]); c.push(code[i]); }
  }
  let partial = 0;
  for (const d of g) {
    const k = c.indexOf(d);
    if (k >= 0) { partial++; c.splice(k, 1); }
  }
  return { exact, partial };
}

function mgRow(body) {
  let r = body.querySelector('.mg-row');
  if (!r) { r = el('div', 'mg-row'); body.appendChild(r); }
  r.innerHTML = '';
  return r;
}

function mgStatus(body, text) {
  let s = body.querySelector('.mg-status');
  if (!s) { s = el('p', 'mg-status'); body.appendChild(s); }
  s.textContent = text;
  return s;
}

// Pinta el final de un minijuego: Continuar si gana; Reintentar y Salir si pierde.
function mgEnd(body, win, retry, done, extra) {
  const row = mgRow(body);
  const res = Object.assign({ win }, extra || {});
  if (win) row.appendChild(mkBtn('Continuar', () => done(res)));
  else {
    row.appendChild(mkBtn('Reintentar', retry));
    row.appendChild(mkBtn('Salir', () => done(res)));
  }
}

function startMinigame(name, opts, cb) {
  const my = ++MG_TOKEN;
  MG_RUN = my;
  const M = MINIGAMES[name];
  const done = r => {
    if (MG_RUN !== my) return;
    MG_RUN = 0;
    forcePanelClose();
    cb(r);
  };
  openPanel(M.title, [], { locked: true, init: body => M.run(body, done, opts || {}, my) });
}

// 1. Auditoría: clasificar documentos. Gana con 4 de 6.
function runAudit(body, done, o, my) {
  body.innerHTML = '';
  const DOCS = [
    ['Acta del consejo 2025', 'Confidencial'],
    ['Folleto de relaciones públicas', 'Público'],
    ['Memes de Recursos Humanos', 'Basura'],
    ['Contrato con Superspeed', 'Confidencial'],
    ['Comunicado_final_FINAL_v3', 'Público'],
    ['Hoja de ruta GRA-6 (NO IMPRIMIR)', 'Confidencial']
  ];
  const CATS = ['Confidencial', 'Público', 'Basura'];
  let i = 0, ok = 0;
  body.appendChild(el('p', 'mg-help', 'Clasifica cada documento antes de la auditoría. Necesitas 4 aciertos de 6.'));
  const doc = el('div', 'mg-doc');
  body.appendChild(doc);
  body.appendChild(el('div', 'mg-row'));
  mgStatus(body, '');

  const step = () => {
    if (i >= DOCS.length) return finish();
    doc.textContent = DOCS[i][0];
    const row = mgRow(body);
    CATS.forEach(c => row.appendChild(mkBtn(c, () => {
      if (!alive(my)) return;
      if (c === DOCS[i][1]) ok++;
      i++;
      step();
    })));
  };
  const finish = () => {
    const win = ok >= 4;
    mgStatus(body, 'Aciertos: ' + ok + '/6. ' + (win ? 'Auditoría superada.' : 'La auditoría encontró demasiado.'));
    mgEnd(body, win, () => runAudit(body, done, o, my), done);
  };
  step();
}

// 2. Recuperar archivos: repetir secuencias de luces. Cuatro rondas, tres errores máximo.
function runRecover(body, done, o, my) {
  body.innerHTML = '';
  const NAMES = ['ARCH_01.dat', 'CONTRATO.pdf', 'RR.HH_bak', 'PPT_FINAL', 'AUDIO_GRA', 'VACACIONES', 'BORRAR', 'FINAL_FINAL', 'CORREO_X'];
  let round = 1, strikes = 0, seq = [], pos = 0, busy = true;
  body.appendChild(el('p', 'mg-help', 'Recupera los archivos repitiendo la secuencia de luces. Cuatro rondas. Tres errores y se pierde.'));
  const grid = el('div', 'grid3');
  body.appendChild(grid);
  const tiles = NAMES.map((n, i) => { const b = mkBtn(n, () => press(i), 'tile'); grid.appendChild(b); return b; });
  const st = mgStatus(body, '');

  const lit = i => {
    tiles[i].classList.add('lit');
    setTimeout(() => tiles[i].classList.remove('lit'), 380);
  };
  const play = () => {
    busy = true;
    st.textContent = 'Observa la secuencia...';
    let k = 0;
    const t = setInterval(() => {
      if (!alive(my)) return clearInterval(t);
      if (k < seq.length) lit(seq[k++]);
      else {
        clearInterval(t);
        busy = false;
        pos = 0;
        st.textContent = 'Tu turno: repite la secuencia.';
      }
    }, 520);
  };
  const newRound = () => {
    seq = Array.from({ length: round + 2 }, () => Math.floor(Math.random() * 9));
    play();
  };
  const press = i => {
    if (busy || !alive(my)) return;
    lit(i);
    if (i !== seq[pos]) {
      strikes++;
      if (strikes >= 3) {
        busy = true;
        mgStatus(body, 'Archivos corruptos. Demasiados errores.');
        return mgEnd(body, false, () => runRecover(body, done, o, my), done);
      }
      st.textContent = 'Error (' + strikes + '/3). Se repite la secuencia.';
      pos = 0;
      busy = true;
      setTimeout(play, 900);
      return;
    }
    if (++pos === seq.length) {
      if (round === 4) {
        busy = true;
        st.textContent = 'Todos los archivos recuperados.';
        return mgEnd(body, true, null, done);
      }
      round++;
      busy = true;
      st.textContent = 'Correcto. Siguiente ronda.';
      setTimeout(newRound, 900);
    }
  };
  newRound();
}

// 3. Contraseña: Mastermind con 8 intentos.
function runPassword(body, done, o, my) {
  body.innerHTML = '';
  const code = o.code || [3, 1, 4], MAX = 8, hist = [];
  body.appendChild(el('p', 'mg-help', o.hint || 'Introduce tres dígitos del 0 al 5.'));
  const sel = [0, 1, 2].map(() => {
    const s = el('select', 'dig');
    for (let d = 0; d <= 5; d++) { const op = el('option', '', String(d)); op.value = d; s.appendChild(op); }
    return s;
  });
  const pw = el('div', 'pw');
  sel.forEach(s => pw.appendChild(s));
  body.appendChild(pw);
  const list = el('ul', 'hist');
  body.appendChild(list);
  const st = mgStatus(body, 'Intentos: 0/' + MAX + '. ● = dígito y posición correctos · ○ = dígito bien en otra posición.');
  const row = el('div', 'mg-row');
  body.appendChild(row);
  row.appendChild(mkBtn('Probar', () => {
    if (!alive(my)) return;
    const g = sel.map(s => Number(s.value));
    const r = mastermindScore(g, code);
    hist.push(g);
    list.appendChild(el('li', '', g.join(' ') + '  →  ' + '●'.repeat(r.exact) + '○'.repeat(r.partial)));
    if (r.exact === code.length) {
      st.textContent = 'ACCESO CONCEDIDO.';
      return mgEnd(body, true, null, done);
    }
    if (hist.length >= MAX) {
      st.textContent = 'ACCESO DENEGADO. El terminal se ha bloqueado.';
      return mgEnd(body, false, () => runPassword(body, done, o, my), done);
    }
    st.textContent = 'Intentos: ' + hist.length + '/' + MAX + '. Sigue probando.';
  }));
}

// 4. Interrogatorio: elegir respuestas. La tensión llega a 80 y la audiencia se cae.
const HEARING = [
  { q: '¿Puede explicar sus reuniones con Alicia Juana?', o: [
    ['Eran reuniones comerciales normales.', 5, false, 'El congresista toma nota. Lo cual es peor.'],
    ['No recuerdo los detalles.', 8, false, 'Se escucha un bostezo en la sala.'],
    ['Necesito consultar con mi abogado.', 6, false, 'Su abogado, en la sala, murmura: «no recomiendo responder».'],
    ['¿Podemos hablar de otra cosa?', 20, true, 'Silencio absoluto. Alguien aplaude desde el fondo.']
  ] },
  { q: '¿Por qué su nombre aparece en los correos de Superspeed?', o: [
    ['Es un error de tipeo.', 6, false, 'Nadie cree en los errores de tipeo.'],
    ['Porque Alicia me cae muy bien.', 20, true, 'El congresista anota «cae muy bien» en su libreta.'],
    ['Lo consultaré en preguntas frecuentes.', 5, false, 'Hay un PowerPoint en pantalla. Nadie lo lee.'],
    ['No es corrupción, es networking.', 20, true, 'La prensa tuitea la frase en menos de dos minutos.']
  ] },
  { q: '¿Qué significa «PROYECTO_AUTOMÓVIL»?', o: [
    ['Un proyecto de ingeniería.', 5, false, 'Demasiado aburrido como para ser verdad.'],
    ['Lo ignoro totalmente.', 8, false, 'Nadie le cree, ni siquiera el micrófono.'],
    ['Un automóvil, obviamente.', 20, true, 'Las risas llegan hasta el pasillo.'],
    ['El lanzamiento no espera a nadie.', 20, true, 'Un asistente llora en silencio.']
  ] }
];

function runInterrogatorio(body, done, o, my) {
  body.innerHTML = '';
  let tension = 30, risky = 0, qi = 0;
  body.appendChild(el('p', 'mg-help', 'Audiencia del comité. Las respuestas arriesgadas suben la tensión. Si llega a 80, la audiencia se cae.'));
  const q = el('div', 'mg-doc');
  body.appendChild(q);
  const react = mgStatus(body, '');
  const meter = el('div', 'meter');
  const fill = el('div', 'mfill');
  meter.appendChild(fill);
  body.appendChild(meter);
  const row = el('div', 'mg-row');
  body.appendChild(row);
  const updateMeter = () => { fill.style.width = clamp(tension, 0, 100) + '%'; };

  const ask = () => {
    if (!alive(my)) return;
    if (qi >= HEARING.length) return finish();
    q.textContent = HEARING[qi].q;
    row.innerHTML = '';
    HEARING[qi].o.forEach(([label, d, isRisky, reaction]) => row.appendChild(mkBtn(label, () => {
      if (!alive(my)) return;
      row.innerHTML = ''; // un doble clic no debe contar dos respuestas
      tension += d;
      if (isRisky) risky++;
      react.textContent = reaction;
      updateMeter();
      qi++;
      if (tension >= 80) return setTimeout(finish, 900); // la audiencia se cae al instante
      setTimeout(ask, 900);
    }, 'btn wide')));
  };
  const finish = () => {
    row.innerHTML = '';
    const win = tension < 80;
    react.textContent = win ? 'Audiencia superada. El comité pasa a otra cosa.' : 'La audiencia se cae. Tensión: ' + tension + '.';
    mgEnd(body, win, () => runInterrogatorio(body, done, o, my), done, { tension, risky });
  };
  ask();
}

// 5. Crisis mediática: cuatro titulares, tres comunicados cada uno. Gana con reputación ≥ 55 y mercado ≥ 50.
const HEADLINES = [
  { h: 'Codicia pierde millones en una sola jornada.', o: [
    ['«Estamos en reestructuración estratégica».', { pub: -5, inv: -5, chaos: 5 }],
    ['«Tenemos la situación bajo control». (No la tenemos.)', { pub: 5, inv: -10, chaos: 15 }],
    ['No publicar nada. Dejar que el mercado respire.', { pub: -10, inv: 0, chaos: 10 }]
  ] },
  { h: 'El CEO desaparecido vuelve a ser tendencia.', o: [
    ['«Juan José disfruta de un merecido descanso».', { pub: -5, inv: 0, chaos: 10 }],
    ['Publicar una foto suya con gorro de gamer (no es de él).', { pub: 10, inv: -5, chaos: 20 }],
    ['Pedir a Recursos Humanos que se encargue.', { pub: -5, inv: -5, chaos: 5 }]
  ] },
  { h: 'China rechaza acusaciones y las redes sociales hacen lo suyo.', o: [
    ['«Respetamos a todos los gobiernos y a todos los memes».', { pub: 10, inv: 5, chaos: 0 }],
    ['Silencio total. El silencio también es una respuesta.', { pub: -5, inv: 0, chaos: 10 }],
    ['Anunciar un producto nuevo con tres chips y una canción.', { pub: 5, inv: 10, chaos: 15 }]
  ] },
  { h: 'Coleta Cris solicita una reunión urgente. Nadie sabe por qué.', o: [
    ['«Hoy hablo con la prensa, no con PowerPoint».', { pub: 15, inv: 0, chaos: 5 }],
    ['«Reunión programada para el 31 de diciembre».', { pub: -10, inv: -10, chaos: 10 }],
    ['Desviar la atención: anunciar la campaña de Navidad.', { pub: 5, inv: 5, chaos: 10 }]
  ] }
];

function runCrisis(body, done, o, my) {
  body.innerHTML = '';
  const base = o.stats || { public: 60, investors: 70 };
  let i = 0;
  const d = { chaos: 0, pub: 0, inv: 0 };
  body.appendChild(el('p', 'mg-help', 'Gestiona la crisis. Necesitas reputación pública de 55 o más y que el mercado no baje de 50. Cada comunicado tiene consecuencias.'));
  const head = el('div', 'mg-doc');
  body.appendChild(head);
  const row = el('div', 'mg-row');
  body.appendChild(row);

  const next = () => {
    if (i >= HEADLINES.length) return finish();
    head.textContent = HEADLINES[i].h;
    row.innerHTML = '';
    HEADLINES[i].o.forEach(([label, e]) => row.appendChild(mkBtn(label, () => {
      if (!alive(my)) return;
      d.chaos += e.chaos || 0;
      d.pub += e.pub || 0;
      d.inv += e.inv || 0;
      i++;
      next();
    }, 'btn wide')));
  };
  const finish = () => {
    const win = base.public + d.pub >= 55 && base.investors + d.inv >= 50;
    head.textContent = win ? 'Titular final: «Codicia responde con calma. Sospechosa calma».' : 'Titular final: «Codicia pierde la confianza del mercado y la suya».';
    mgEnd(body, win, () => runCrisis(body, done, o, my), done, { deltas: d });
  };
  next();
}

// 6. Ventanas emergentes: reflejos contra el reloj. Cierra 10, no dejes escapar 5, en 15 s.
function runPopups(body, done, o, my) {
  body.innerHTML = '';
  const NEED = 10, MAXMISS = 5, LIMIT = 15;
  let closed = 0, miss = 0, over = false;
  const t0 = Date.now();
  body.appendChild(el('p', 'mg-help', 'Cierra las ventanas emergentes antes de que se multipliquen. Necesitas ' + NEED + ' cierres y no puedes dejar escapar ' + MAXMISS + '.'));
  const field = el('div', 'pop-field');
  body.appendChild(field);
  const st = mgStatus(body, '');
  let spawner = null, tick = null;
  const finish = win => {
    if (over) return;
    over = true;
    clearInterval(spawner);
    clearInterval(tick);
    mgEnd(body, win, () => runPopups(body, done, o, my), done, { closed });
  };
  const refresh = () => {
    if (!alive(my)) return; // un temporizador viejo no debe tocar el panel de otro minijuego
    const left = Math.max(0, LIMIT - Math.floor((Date.now() - t0) / 1000));
    st.textContent = 'Cerrados: ' + closed + '/' + NEED + ' · Escapados: ' + miss + '/' + MAXMISS + ' · Tiempo: ' + left + ' s';
    if (closed >= NEED) finish(true);
    else if (miss >= MAXMISS) finish(false);
  };
  const spawn = () => {
    if (over || !alive(my)) return;
    const w = el('div', 'popwin');
    w.style.left = Math.floor(Math.random() * 76) + '%';
    w.style.top = Math.floor(Math.random() * 70) + '%';
    w.appendChild(el('span', '', 'AVISO #' + Math.floor(100 + Math.random() * 900)));
    w.appendChild(mkBtn('X', () => {
      if (over || !alive(my)) return;
      closed++;
      w.remove();
      refresh();
    }, 'pop-x'));
    field.appendChild(w);
    setTimeout(() => {
      if (w.isConnected && !over && alive(my)) { w.remove(); miss++; refresh(); }
    }, 2200);
  };
  // Si la partida de este minijuego ya terminó (done), se detienen sin tocar el DOM.
  const stopSilently = () => { over = true; clearInterval(spawner); clearInterval(tick); };
  spawner = setInterval(() => { if (over || !alive(my)) return stopSilently(); spawn(); }, 650);
  tick = setInterval(() => {
    if (over || !alive(my)) return stopSilently();
    refresh();
    if (!over && Date.now() - t0 >= LIMIT * 1000) finish(closed >= NEED);
  }, 250);
  refresh();
}

// 7. Clasificar correos: seis segundos por correo, necesitas 6 aciertos de 8.
const MAILS = [
  ['Coleta Cris', 'Reunión de presupuesto, sala 2', 'Importante'],
  ['PREMIO-GRA', '¡Ganaste una silla gamer! Haz clic ya', 'Spam'],
  ['Recursos Humanos', 'Firma pendiente del memorándum', 'Importante'],
  ['Superspeed Offers', 'Chips exclusivos (no lo son)', 'Spam'],
  ['Teo Ixcol', 'Citación del comité, 9:00 a. m.', 'Importante'],
  ['Newsletter Codicia', 'Los mejores memes corporativos del mes', 'Spam'],
  ['Auditoría interna', 'Documento pendiente de firma', 'Importante'],
  ['Lotería Global', 'Tu cuenta ha sido seleccionada', 'Spam']
];

function runTriage(body, done, o, my) {
  body.innerHTML = '';
  const items = MAILS.slice().sort(() => Math.random() - 0.5);
  let i = 0, ok = 0, tmr = null;
  body.appendChild(el('p', 'mg-help', 'Separa los correos importantes del spam. Tienes 6 segundos por correo. Necesitas 6 aciertos de 8.'));
  const card = el('div', 'mg-doc');
  body.appendChild(card);
  const bar = el('div', 'meter');
  const fill = el('div', 'mfill');
  bar.appendChild(fill);
  body.appendChild(bar);
  const row = el('div', 'mg-row');
  body.appendChild(row);
  const st = mgStatus(body, '');

  const finish = () => {
    clearTimeout(tmr);
    const win = ok >= 6;
    st.textContent = 'Aciertos: ' + ok + '/' + items.length + '.';
    mgEnd(body, win, () => runTriage(body, done, o, my), done, { ok });
  };
  const show = () => {
    if (i >= items.length) return finish();
    const m = items[i];
    card.textContent = 'De: ' + m[0] + '\nAsunto: ' + m[1];
    row.innerHTML = '';
    row.appendChild(mkBtn('Importante', () => answer('Importante'), 'btn wide'));
    row.appendChild(mkBtn('Spam', () => answer('Spam'), 'btn wide'));
    st.textContent = 'Correo ' + (i + 1) + '/' + items.length + ' · Aciertos: ' + ok;
    fill.style.transition = 'none';
    fill.style.width = '100%';
    requestAnimationFrame(() => { fill.style.transition = 'width 6s linear'; fill.style.width = '0%'; });
    clearTimeout(tmr);
    tmr = setTimeout(() => { if (alive(my)) { i++; show(); } }, 6000);
  };
  const answer = cat => {
    if (!alive(my)) return;
    clearTimeout(tmr);
    if (cat === items[i][2]) ok++;
    i++;
    show();
  };
  show();
}

const MINIGAMES = {
  audit: { title: 'AUDITORÍA: CLASIFICAR DOCUMENTOS', run: runAudit },
  recover: { title: 'RECUPERAR ARCHIVOS', run: runRecover },
  password: { title: 'TERMINAL PROTEGIDO', run: runPassword },
  interrogatorio: { title: 'AUDIENCIA DEL COMITÉ', run: runInterrogatorio },
  crisis: { title: 'GESTIÓN DE CRISIS', run: runCrisis },
  popups: { title: 'VENTANAS EMERGENTES', run: runPopups },
  triage: { title: 'BANDEJA DE ENTRADA', run: runTriage }
};

if (typeof module !== 'undefined') module.exports = { mastermindScore };
