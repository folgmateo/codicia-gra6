// Capítulos, diálogos, finales, logros y noticias. Usa la API G de game.js.
// Un ítem de diálogo es: [Hablante, texto] | función (acción) | { choices: [[etiqueta, ítems], ...] }

const CHAPTERS = [
  {
    title: 'EL CEO SE FUE A ALMORZAR', sub: 'Noviembre de 2026', tint: 'rgba(40,60,120,0.12)', start: [9, 6],
    map: [
      '####################',
      '#P..D.D..#....#..P.#',
      '#........#....#....#',
      '#.D.D.D..#....#.DD.#',
      '#..................#',
      '#...S.....#CCCC....#',
      '#.........#CCCC....#',
      '#.P.......#CCCC....#',
      '#.........#CCCC....#',
      '#..........D.......#',
      '####################'
    ],
    objects: [
      { id: 'escritorio', k: 'pc', x: 17, y: 3, task: 'escritorio' },
      { id: 'renuncia', k: 'doc', x: 17, y: 2, task: 'renuncia' },
      { id: 'mail1', k: 'mail', x: 2, y: 2, task: 'mail1' },
      { id: 'mail2', k: 'mail', x: 8, y: 8, task: 'mail2' },
      { id: 'mail3', k: 'mail', x: 4, y: 8, task: 'mail3' },
      { id: 'calendario', k: 'cal', x: 18, y: 5, task: 'calendario' },
      { id: 'auditoria', k: 'folder', x: 1, y: 9, task: 'auditoria' }
    ],
    npcs: [
      { id: 'coleta', name: 'Coleta Cris', look: 'coleta', x: 12, y: 3 },
      { id: 'alicia1', name: 'Alicia Juana', look: 'alicia', x: 15, y: 8, when: 'alicia_visible' }
    ],
    tasks: [
      { id: 'escritorio', text: 'Revisar el escritorio de Juan José' },
      { id: 'renuncia', text: 'Encontrar la carta de renuncia' },
      { id: 'mail1', text: 'Recuperar el correo 1' },
      { id: 'mail2', text: 'Recuperar el correo 2' },
      { id: 'mail3', text: 'Recuperar el correo 3' },
      { id: 'coleta', text: 'Hablar con Coleta Cris' },
      { id: 'calendario', text: 'Descubrir la reunión con Alicia Juana' },
      { id: 'auditoria', text: 'Ordenar los documentos antes de la auditoría' }
    ],
    intro: [
      ['Sistema', 'NOTICIA DE ÚLTIMA HORA: «JUAN JOSÉ RENUNCIA COMO CEO, PRESIDENTE Y MIEMBRO DEL CONSEJO».'],
      ['Tú', 'Ayer almorzó con el equipo y hoy ya no es CEO. Qué rápido.'],
      ['Coleta Cris', 'Soy CEO interina. Fantástico. Alguien que traiga café y una explicación.'],
      ['Sistema', 'Noticia secundaria: el Congreso de EE. UU. pide explicaciones sobre Superspeed.'],
      () => G.stat('chaos', 20),
      () => G.news('Codicia cae un 2% tras la renuncia de su CEO.')
    ]
  },
  {
    title: '404 — CONFIANZA NO ENCONTRADA', sub: 'La investigación se intensifica', tint: 'rgba(30,90,80,0.12)', start: [2, 8], light: 130,
    map: [
      '####################',
      '#.R.R.R.#..........#',
      '#.R.R.R.#...DD.....#',
      '#.R.R.R.#..........#',
      '#.......#.....R.R..#',
      '#.......#.....R.R..#',
      '#.R.R.R..........R.#',
      '#.......#..........#',
      '#.......#...D......#',
      '#.......#..........#',
      '####################'
    ],
    objects: [
      { id: 'pc', k: 'lock', x: 11, y: 2, task: 'pc' },
      { id: 'archivos', k: 'folder', x: 17, y: 7, task: 'archivos' },
      { id: 'registro', k: 'doc', x: 6, y: 3, task: 'registro' },
      { id: 'comparar', k: 'red', x: 6, y: 6, task: 'comparar' },
      { id: 'vacaciones', k: 'folder', x: 2, y: 7 },
      { id: 'proyecto', k: 'folder', x: 10, y: 8 },
      { id: 'correo', k: 'mail', x: 3, y: 9 },
      { id: 'recibo', k: 'cup', x: 16, y: 1 }
    ],
    npcs: [
      { id: 'alicia', name: 'Alicia Juana', look: 'alicia', x: 11, y: 5 }
    ],
    tasks: [
      { id: 'pc', text: 'Desbloquear el ordenador protegido' },
      { id: 'archivos', text: 'Recuperar los archivos eliminados' },
      { id: 'registro', text: 'Encontrar el registro de reuniones' },
      { id: 'comparar', text: 'Comparar las versiones del contrato' },
      { id: 'alicia', text: 'Hablar con Alicia Juana' }
    ],
    intro: [
      ['Sistema', 'Servidores de Codicia. Zona de acceso restringido. Hace frío aquí, o al menos eso dice el termostato.'],
      ['Tú', 'El nombre de Alicia Juana aparece en todas partes. Hay que reconstruir sus reuniones con Juan José.'],
      ['Tú', 'Hay un post-it en un monitor: «Juan no quiso perder el lanzamiento». ¿Qué lanzamiento?']
    ]
  },
  {
    title: 'EL CONGRESO QUIERE HABLAR CONTIGO', sub: 'Washington, en directo', tint: 'rgba(90,40,40,0.10)', start: [9, 8],
    map: [
      '####################',
      '#WWWWWWWWWWWWWWWWWW#',
      '#..................#',
      '#....D.D.D.D.......#',
      '#..SSSSSSSSSS......#',
      '#..SSSSSSSSSS......#',
      '#..................#',
      '#.....P.......P....#',
      '#..................#',
      '#.........D........#',
      '####################'
    ],
    objects: [
      { id: 'preparacion', k: 'doc', x: 6, y: 2, task: 'preparacion' },
      { id: 'preguntas', k: 'doc', x: 13, y: 3, task: 'preguntas' },
      { id: 'audiencia', k: 'pod', x: 10, y: 8, task: 'audiencia' },
      { id: 'nota', k: 'red', x: 16, y: 6 },
      { id: 'filtracion', k: 'folder', x: 2, y: 8, task: 'filtracion' },
      { id: 'bandeja', k: 'mail', x: 3, y: 3, task: 'bandeja' }
    ],
    npcs: [
      { id: 'coleta3', name: 'Coleta Cris', look: 'coleta', x: 10, y: 6 },
      { id: 'teo', name: 'Teo Ixcol', look: 'teo', x: 5, y: 6 }
    ],
    tasks: [
      { id: 'preparacion', text: 'Preparar el dossier del Congreso' },
      { id: 'preguntas', text: 'Revisar las preguntas del comité' },
      { id: 'audiencia', text: 'Superar la audiencia' },
      { id: 'declaracion', text: 'Redactar la declaración de Coleta' },
      { id: 'filtracion', text: 'Investigar la filtración' },
      { id: 'bandeja', text: 'Separar la bandeja de correos del comité' }
    ],
    intro: [
      ['Sistema', 'COMITÉ DE LA CÁMARA Y EL SENADO: solicitud de comparecencia de Juan José.'],
      ['Sistema', 'Mensaje de Juan José (texto): «¿Alguien ha mencionado el lanzamiento? No. Perfecto».'],
      () => G.stat('chaos', 15),
      ['Tú', 'Lo único claro es que nadie duerme en este piso.']
    ]
  },
  {
    title: 'EL MERCADO NO TIENE PACIENCIA', sub: 'Sesión de bolsa, 9:31 a. m.', tint: 'rgba(60,60,20,0.10)', start: [9, 8],
    map: [
      '####################',
      '#WWWWWWWWWWWWWWWWWW#',
      '#..P...............#',
      '#.....CCCCCCCC.....#',
      '#.....CCDDDDCC.....#',
      '#.....CCDDDDCC.....#',
      '#.....CCCCCCCC.....#',
      '#..................#',
      '#..R.......P.......#',
      '#..R...............#',
      '####################'
    ],
    objects: [
      { id: 'servidor', k: 'pc', x: 3, y: 9, task: 'servidor' },
      { id: 'prensa', k: 'phone', x: 15, y: 7, task: 'crisis' },
      { id: 'carpeta', k: 'folder', x: 17, y: 2, task: 'carpeta' }
    ],
    npcs: [
      { id: 'consejo', name: 'Consejero Rovira', look: 'consejo', x: 9, y: 6 }
    ],
    tasks: [
      { id: 'consejo', text: 'Calmar al consejo de administración' },
      { id: 'crisis', text: 'Controlar la crisis mediática' },
      { id: 'servidor', text: 'Revisar el servidor de documentos' },
      { id: 'carpeta', text: 'Encontrar la carpeta oculta' }
    ],
    intro: [
      ['Sistema', 'El precio de Codicia cae un 4% en la sesión de la mañana.'],
      ['Coleta Cris', 'Necesito respuestas, no otro comunicado de relaciones públicas.'],
      ['Coleta Cris', 'Juan siempre mira ese contador en su monitor. ¿Quién necesita un contador para un almuerzo?'],
      () => G.stat('chaos', 10)
    ]
  },
  {
    title: 'EL VERDADERO NEGOCIO', sub: 'Detrás del despacho de Juan José', tint: 'rgba(70,30,90,0.14)', start: [2, 7], light: 110,
    map: [
      '####################',
      '#..................#',
      '#.S.S..RRRR........#',
      '#..................#',
      '#.....CCCCCC.......#',
      '#.....CCDDCC.......#',
      '#.....CCCCCC.......#',
      '#..................#',
      '#.P........S.......#',
      '#..................#',
      '####################'
    ],
    objects: [
      { id: 'sala', k: 'lock', x: 16, y: 1, task: 'sala' },
      { id: 'calendario_secreto', k: 'cal', x: 3, y: 4, task: 'calendario_secreto' },
      { id: 'reuniones', k: 'doc', x: 6, y: 2, task: 'reuniones' },
      { id: 'plan', k: 'red', x: 9, y: 5, task: 'plan' },
      { id: 'rrhh', k: 'doc', x: 14, y: 8, task: 'rrhh' },
      { id: 'mando', k: 'gamer', x: 4, y: 8 },
      { id: 'pantallas', k: 'pc', x: 4, y: 3, task: 'pantallas' },
      { id: 'pizarra', k: 'doc', x: 17, y: 4, task: 'acusacion' }
    ],
    npcs: [
      { id: 'juan', name: 'Juan José', look: 'juan', x: 9, y: 2, when: 'final' }
    ],
    tasks: [
      { id: 'sala', text: 'Abrir la sala secreta' },
      { id: 'calendario_secreto', text: 'Leer el calendario secreto' },
      { id: 'reuniones', text: 'Revisar la lista de reuniones' },
      { id: 'plan', text: 'Descubrir el plan de liberación' },
      { id: 'rrhh', text: 'Leer el memorándum de RR. HH.' },
      { id: 'pantallas', text: 'Cerrar las ventanas emergentes del terminal' },
      { id: 'acusacion', text: 'Señalar al filtrador ante el comité' }
    ],
    intro: [
      ['Narrador', 'Una habitación secreta detrás del despacho de Juan José. En la puerta, un cartel: «NO ENTRAR SIN PARTIDA».'],
      ['Tú', 'Esto no es una sala de reuniones. Esto es un búnker de videojuegos con aire acondicionado.']
    ]
  }
];

// Acciones por objeto o NPC. Se llaman al interactuar (tecla E).
const ACTIONS = {
  // Capítulo 1
  escritorio: () => G.say([
    ['Tú', 'Dos monitores apagados. Un post-it dice: «NO TOCAR. REUNIÓN MUY IMPORTANTE».'],
    ['Tú', 'En el borde de un monitor queda una pegatina: «GRA (6) — cuenta atrás». Alguien la borró a medias.']
  ], () => G.task('escritorio')),

  renuncia: () => G.say([
    ['Tú', 'Carta de renuncia firmada. «Dejo mis cargos por motivos personales y estratégicos».'],
    ['Tú', 'La firma es verde. Muy de CEO, muy de marcador.']
  ], () => { G.item('Carta de renuncia', 'Firmada con marcador verde.'); G.task('renuncia'); }),

  mail1: () => G.say([
    ['Tú', 'Correo de Juan José a Juan José: «Si Coleta pregunta, es una reestructuración estratégica. Si pregunta otra vez, es aún más estratégica».']
  ], () => G.task('mail1')),

  mail2: () => G.say([
    ['Tú', 'Correo de Alicia Juana: «Solo estábamos hablando de negocios. No todo lo que parece sospechoso es ilegal».']
  ], () => { G.evidence(1); G.task('mail2'); }),

  mail3: () => G.say([
    ['Tú', 'Pedido confirmado: 1 silla gamer, 3 monitores, 12 bebidas energéticas. Entrega: 18 de diciembre.']
  ], () => { G.item('Pedido de silla gamer', 'Una silla gamer y 12 energéticas.', true); G.task('mail3'); }),

  calendario: () => G.say([
    ['Tú', 'Calendario de pared. Noviembre tiene un corazón. Diciembre tiene el 18 en rojo, con un automóvil dibujado al lado.'],
    ['Tú', 'Debajo, en letra de Juan: «Reunión con A. J. — sala 3 — 10:00». Nada más.'],
    ['Sistema', 'Evento detectado: reunión no programada con Superspeed.'],
    () => G.flag('alicia_visible')
  ], () => { G.clue('calendario', 'Reunión con A. J. a las 10:00 en la sala 3.', 'Alicia Juana'); G.task('calendario'); }),

  auditoria: () => G.minigame('audit', {}, r => {
    if (!r.win) return;
    G.say([['Sistema', 'Auditoría superada. Coleta respira por primera vez en el día.']], () => G.task('auditoria'));
  }),

  coleta: () => G.say([
    ['Coleta Cris', '¿Por qué hay una investigación internacional en mi calendario?'],
    ['Coleta Cris', 'Necesito respuestas, no otro comunicado de relaciones públicas.'],
    ['Tú', 'Y ahora, ¿qué hago?'],
    { choices: [
      ['¿Y Juan José?', [
        ['Coleta Cris', 'En «una reunión muy importante». Desde hace tres días.'],
        ['Coleta Cris', 'Su monitor tiene un contador que no deja de bajar. Lo mira cada cinco minutos.'],
        ['Tú', 'Quizá quiere cuadrar el calendario.']
      ]],
      ['Ayúdame con la auditoría.', [
        ['Coleta Cris', 'Bien. Empieza por ordenar esos documentos. Hay auditoría el viernes.']
      ]]
    ] }
  ], () => G.task('coleta')),

  alicia1: () => G.say([
    ['Alicia Juana', 'Solo estábamos hablando de negocios.'],
    ['Alicia Juana', 'No todo lo que parece sospechoso es ilegal.'],
    ['Alicia Juana', 'Creo que ustedes tienen demasiada imaginación.']
  ]),

  // Capítulo 2
  pc: () => {
    if (S.flags.pc_ok) return G.say([['Tú', 'Ya está desbloqueado. Carpeta por carpeta, el caos.']]);
    G.say([
      ['Sistema', 'CONTRASEÑA REQUERIDA. Tres dígitos del 0 al 5.'],
      ['Tú', 'Post-it en el monitor: «Empieza igual que la constante favorita de los matemáticos».']
    ], () => G.minigame('password', {
      code: [3, 1, 4],
      hint: 'Pista: los primeros dígitos de la constante favorita de los matemáticos. Tres dígitos del 0 al 5.'
    }, r => {
      if (!r.win) return;
      G.flag('pc_ok');
      G.say([['Sistema', 'ACCESO CONCEDIDO. Bienvenido, Juan.']], () => G.task('pc'));
    }));
  },

  archivos: () => {
    if (!S.flags.pc_ok) return G.say([['Tú', 'Carpeta bloqueada. Primero el ordenador.']]);
    G.minigame('recover', {}, r => {
      if (!r.win) return;
      G.achieve('404');
      G.say([['Sistema', 'Archivos recuperados: CONTRATO_SUPERSPEED, REGISTRO_REUNIONES, VACACIONES_DICIEMBRE.']],
        () => G.task('archivos'));
    });
  },

  registro: () => {
    if (!S.flags.pc_ok) return G.say([['Tú', 'El registro está cifrado. Hace falta el ordenador desbloqueado.']]);
    G.say([
      ['Tú', 'Registro de reuniones: 14 con Superspeed. Ocho sin agenda.'],
      ['Tú', 'Una dice: «Lanzamiento — 18/12 — asistente: J. J.».']
    ], () => { G.clue('registro', 'Acceso a las 2:13 a. m. con la tarjeta de la CEO interina.', 'Coleta Cris'); G.task('registro'); });
  },

  comparar: () => G.say([
    ['Tú', 'Dos versiones del mismo contrato. Una tiene fecha de octubre, la otra de noviembre. Idénticas en todo lo demás.'],
    { choices: [
      ['Señalar la diferencia.', [
        ['Tú', 'Alguien cambió la fecha con prisa. Eso se nota.'],
        () => { G.evidence(1); G.stat('chaos', 5); G.clue('contrato', 'La fecha del contrato la cambió alguien con prisa.', 'Consejero Rovira'); }
      ]],
      ['No es mi problema.', [
        ['Tú', 'Mejor lo dejo. Hay que sobrevivir a esta semana.']
      ]]
    ] }
  ], () => G.task('comparar')),

  vacaciones: () => G.say([
    ['Tú', 'Carpeta VACACIONES_DICIEMBRE. Un solo archivo: itinerario.txt.'],
    ['Tú', '«Día 1: no ir a la oficina. Día 2: no ir a la oficina. Día 18: GRA (6).»']
  ]),

  proyecto: () => G.say([
    ['Tú', 'PROYECTO_AUTOMÓVIL: imágenes de un coche deportivo. Último archivo: NO_BORRAR_GRA6.txt.']
  ]),

  correo: () => G.say([
    ['Tú', '«No puedo perderme el lanzamiento». Borrador enviado a sí mismo once veces.']
  ]),

  recibo: () => G.say([
    ['Tú', 'Recibo de tienda de videojuegos: 1 edición coleccionista de GRA (6). Pagado en efectivo, con sonrisa.']
  ], () => G.item('Recibo de tienda', 'Edición coleccionista de GRA (6).', true)),

  alicia: () => G.say([
    ['Alicia Juana', 'Los documentos hablan. Ustedes también, al parecer.'],
    { choices: [
      ['Hablemos de negocios.', [
        ['Alicia Juana', 'Solo estábamos hablando de negocios.']
      ]],
      ['Confirmar que no es espía.', [
        ['Alicia Juana', 'Creo que ustedes tienen demasiada imaginación.'],
        () => G.achieve('no_espia')
      ]],
      ['Mostrar las pruebas.', [
        ['Tú', 'Tu nombre aparece en siete correos con Juan José.'],
        ['Alicia Juana', 'Y en cuatro con logística. Eso no es espionaje, es paciencia.'],
        () => G.evidence(1)
      ]]
    ] }
  ], () => G.task('alicia')),

  // Capítulo 3
  preparacion: () => G.say([
    ['Tú', 'Dossier para el Congreso: 84 páginas. Ochenta y una dicen «no recuerdo» en distintos idiomas.'],
    ['Tú', 'Las otras tres son el índice.']
  ], () => { G.item('Dossier del Congreso', '84 páginas de «no recuerdo».'); G.task('preparacion'); }),

  preguntas: () => G.say([
    ['Tú', 'Preguntas del comité: «¿Puede explicar sus reuniones con Alicia Juana?»'],
    ['Tú', 'En la página siguiente, dos actas de la misma reunión con fechas distintas.'],
    { choices: [
      ['Marcar la contradicción.', [
        ['Tú', 'Esto no cuadra. Lo marco en rojo.'],
        () => G.evidence(1)
      ]],
      ['Pasar la página.', [
        ['Tú', 'No es mi departamento. Todavía.']
      ]]
    ] }
  ], () => G.task('preguntas')),

  audiencia: () => G.say([
    ['Sistema', 'AUDIENCIA DEL COMITÉ. Juan José no comparece. Aun así, tiene un asiento reservado.'],
    ['Tú', 'Vamos a prepararlo bien.']
  ], () => G.minigame('interrogatorio', {}, r => {
    if (r.risky >= 3) G.achieve('abogado');
    if (r.win) {
      G.stat('chaos', Math.round((r.tension - 30) / 2));
      G.stat('board', 5);
      G.say([['Sistema', 'Audiencia superada. Tensión final: ' + r.tension + '.']], () => G.task('audiencia'));
    }
  })),

  nota: () => G.say([
    ['Coleta Cris', 'Nota pegada en el archivador: «NO PROGRAMAR REUNIONES DURANTE EL EVENTO».'],
    ['Tú', '¿Qué evento?'],
    ['Coleta Cris', 'Eso mismo pregunto yo.']
  ], () => G.flag('nota')),

  coleta3: () => G.say([
    ['Coleta Cris', 'Necesito una declaración pública. Ya.'],
    { choices: [
      ['Tono serio: «Estamos cooperando plenamente».', [
        ['Coleta Cris', 'Perfecto. Aburrido, pero perfecto.'],
        () => G.stat('public', 5)
      ]],
      ['Tono sarcástico: «No es corrupción, es networking».', [
        ['Coleta Cris', 'Eso va a salir en todas las portadas.'],
        () => { G.stat('public', -5); G.stat('chaos', 10); }
      ]],
      ['Tono humilde: «Nos equivocamos. Aprenderemos».', [
        ['Coleta Cris', 'Mejor. Ahora hay que pedir perdón con una foto.'],
        () => G.stat('board', 5)
      ]]
    ] }
  ], () => G.task('declaracion')),

  teo: () => G.say([
    ['Teo Ixcol', '¿Hay novedades?'],
    ['Tú', 'Juan José no quiere declarar sin abogado.'],
    ['Teo Ixcol', 'La investigación continúa.'],
    ['Tú', '¿Eso es todo?'],
    ['Teo Ixcol', 'Es todo lo que digo. Y es lo único que digo.']
  ], () => G.clue('teo', 'Teo tiene copia de las actas. No dice de dónde.', 'Teo Ixcol')),

  filtracion: () => G.say([
    ['Sistema', 'Documentos filtrados a la prensa: tres actas internas. Titular: «CODICIA SABÍA».'],
    () => G.stat('chaos', 20),
    () => G.clue('filtracion', 'Las actas salieron de la red a las 2:13 a. m.', 'Coleta Cris'),
    { choices: [
      ['Buscar al filtrador.', [
        ['Tú', 'Registro de acceso a las 2:13 a. m. Alguien se quedó trabajando.'],
        () => G.evidence(1)
      ]],
      ['Publicar un borrador falso.', [
        ['Tú', 'Falso, pero entretenido. Ahora hay dos versiones de la verdad.'],
        () => G.stat('public', -5)
      ]]
    ] }
  ], () => G.task('filtracion')),

  // Capítulo 4
  consejo: () => G.say([
    ['Consejero Rovira', 'Esto no es una crisis, es una reestructuración estratégica. ¿Verdad?'],
    { choices: [
      ['Tranquilo. Todo va bien.', [
        ['Consejero Rovira', 'Eso lo dijeron antes de la renuncia.'],
        () => { G.stat('board', -10); G.clue('consejo', 'Rovira sabía de la renuncia antes de que se anunciara.', 'Consejero Rovira'); }
      ]],
      ['Acepto el riesgo y presento datos.', [
        ['Consejero Rovira', 'Datos. Me gustan los datos.'],
        () => { G.stat('board', 10); G.stat('investors', -5); }
      ]],
      ['Pido un voto de confianza.', [
        ['Consejero Rovira', 'Tiene nuestro voto. Ahora necesita resultados.'],
        () => G.stat('board', 5)
      ]]
    ] }
  ], () => G.task('consejo')),

  prensa: () => G.minigame('crisis', { stats: S.stats }, r => {
    if (!r.win) return;
    const d = r.deltas;
    G.stat('chaos', d.chaos);
    G.stat('public', d.pub);
    G.stat('investors', d.inv);
    G.say([['Sistema', 'Titular final: «Codicia responde con calma. Sospechosa calma».']], () => G.task('crisis'));
  }),

  servidor: () => G.say([
    ['Tú', 'Servidor. Una carpeta llamada FINAL_FINAL_AHORA_SÍ. Dentro, documentos que no deberían existir.'],
    { choices: [
      ['Borrar los archivos sospechosos.', [
        ['Tú', 'Borrado. Quien lo busque ahora no encontrará nada.'],
        () => { S.cover = true; G.stat('chaos', 5); }
      ]],
      ['Copiarlo todo a una memoria.', [
        ['Tú', 'Esto es evidencia. Lo guardo.'],
        () => { G.evidence(1); G.clue('servidor', 'Los documentos de FINAL_FINAL usan la cuenta de Coleta.', 'Coleta Cris'); }
      ]]
    ] }
  ], () => G.task('servidor')),

  carpeta: () => G.say([
    ['Tú', 'Carpeta oculta detrás de un cuadro falso. Dentro hay un documento cifrado.'],
    ['Tú', 'Título: «OPERACIÓN GRA-6». El resto está en clave.'],
    () => { G.flag('gra6_seen'); G.item('OPERACIÓN GRA-6 (cifrado)', 'Documento que empieza con «Plan de liberación».'); }
  ], () => G.task('carpeta')),

  // Capítulo 5
  sala: () => G.say([
    ['Sistema', 'ZONA RESTRINGIDA. Código de tres dígitos del 0 al 5.'],
    ['Tú', 'Nota adhesiva: «2 = dos semanas de vacaciones. 0 = cero reuniones. 5 = la campaña».']
  ], () => G.minigame('password', {
    code: [2, 0, 5],
    hint: 'Notas: 2 = dos semanas de vacaciones · 0 = cero reuniones · 5 = la campaña.'
  }, r => {
    if (!r.win) return;
    G.say([
      ['Sistema', 'ACCESO CONCEDIDO. Hay una silla gamer en el centro de la sala.'],
      ['Tú', 'Tres monitores encendidos. Uno dice: «GRA (6): 18 de diciembre».']
    ], () => G.task('sala'));
  })),

  calendario_secreto: () => G.say([
    ['Tú', 'Calendario secreto. Cada día de noviembre tachado. El 18 de diciembre tiene un corazón, un coche y la frase: «NO PROGRAMAR NADA».']
  ], () => G.task('calendario_secreto')),

  reuniones: () => G.say([
    ['Tú', 'Lista de reuniones: «Coleta — reestructuración», «Superspeed — ping», «Congreso — opcional».'],
    ['Tú', 'La última: «Lanzamiento (asistencia obligatoria)».']
  ], () => { G.clue('reuniones', 'Coleta tiene una reunión marcada con «Diario Nocturno».', 'Coleta Cris'); G.task('reuniones'); }),

  plan: () => G.say([
    ['Tú', 'OPERACIÓN GRA-6: PLAN DE LIBERACIÓN.'],
    ['Tú', 'Juan llevaba meses planeando dejar temporalmente sus responsabilidades para jugar el lanzamiento de GRAN ROBO DE AUTOMÓVILES 6.'],
    ['Tú', 'La investigación, las reuniones y la crisis eran la cobertura perfecta. Cada reunión tenía un propósito: conseguir tiempo libre.'],
    ['Tú', 'Alicia, quizá, solo era una compañera de partida. Quizá había otros asuntos. El plan no lo aclara.'],
    () => { G.achieve('plan'); G.reveal(); }
  ], () => G.task('plan')),

  rrhh: () => G.say([
    ['Tú', 'Memorándum de Recursos Humanos: «Vacaciones aprobadas para J. J., 18/12. Sin preguntas. Firmado: RR. HH.»'],
    () => G.flag('rrhh_known'),
    { choices: [
      ['Unirme al plan de Recursos Humanos.', [
        ['Tú', 'Vacaciones pagadas. Hasta yo quiero una silla gamer.'],
        () => { S.hr = true; }
      ]],
      ['Denunciar el memorándum.', [
        ['Tú', 'Denuncio. Que sea el Congreso quien se aburra.'],
        () => { S.hr = false; G.evidence(1); }
      ]]
    ] }
  ], () => { G.clue('rrhh', 'Recursos Humanos aprobó las vacaciones antes de que existiera el plan.', 'Recursos Humanos'); G.task('rrhh'); }),

  mando: () => G.say([
    ['Tú', 'Mando de prueba de GRA (6). Tiene manchas de papas fritas.']
  ], () => G.item('Mando de GRA (6)', 'Edición de prueba con manchas de papas fritas.', true)),

  bandeja: () => G.minigame('triage', {}, r => {
    if (!r.win) return;
    G.say([['Sistema', 'Bandeja ordenada. Los correos importantes ya están marcados.']], () => G.task('bandeja'));
  }),

  pantallas: () => G.minigame('popups', {}, r => {
    if (!r.win) return;
    G.say([['Sistema', 'Ventanas cerradas. El terminal respira. Por ahora.']], () => G.task('pantallas'));
  }),

  pizarra: () => G.say([
    ['Tú', 'Pizarra del comité. Alguien ha escrito en rojo: «¿QUIÉN FILTRÓ LAS ACTAS?».'],
    ['Tú', 'Antes de cerrar el caso hay que señalar a alguien. Y no se puede deshacer.'],
    { choices: [
      ['Señalar a Alicia Juana.', [
        ['Tú', 'Tenía contactos, pero no las actas.'],
        () => { S.accuse = 'Alicia Juana'; saveGame(); }
      ]],
      ['Señalar a Teo Ixcol.', [
        ['Tú', 'Tenía copias, pero no las subió a la red.'],
        () => { S.accuse = 'Teo Ixcol'; saveGame(); }
      ]],
      ['Señalar al consejero Rovira.', [
        ['Tú', 'Sabía demasiado, pero no tenía acceso al servidor.'],
        () => { S.accuse = 'Consejero Rovira'; saveGame(); }
      ]],
      ['Señalar a Recursos Humanos.', [
        ['Tú', 'Firmaron mucho, pero no filtraron nada.'],
        () => { S.accuse = 'Recursos Humanos'; saveGame(); }
      ]],
      ['Señalar a Coleta Cris.', [
        ['Tú', 'Tenía la tarjeta, las llaves y la prisa. Es ella.'],
        () => { S.accuse = 'Coleta Cris'; saveGame(); }
      ]]
    ] }
  ], () => G.task('acusacion')),

  juan: () => G.say([
    ['Juan José', 'Ah. Llegaste antes de lo previsto.']
  ])
};

// Logros
const ACHIEVEMENTS = {
  ceo: { name: 'EL CEO DEL AÑO', d: 'Completa el final principal.' },
  no_espia: { name: 'NO ERA UN ESPÍA', d: 'Termina la investigación de Alicia Juana.' },
  '404': { name: '404', d: 'Recupera todos los archivos eliminados.' },
  abogado: { name: 'EL ABOGADO NO RECOMIENDA', d: 'Elige las respuestas más arriesgadas en una audiencia.' },
  plan: { name: 'EL PLAN PERFECTO', d: 'Descubre la Operación GRA-6.' },
  gamer: { name: 'ADICTO AL GAMING', d: 'Encuentra los tres objetos de videojuegos.' },
  rrhh: { name: 'RECURSOS HUMANOS', d: 'Desbloquea el final secreto.' }
};

// Finales
const ENDINGS = {
  verdad: { title: 'LA FILTRADORA', text: 'Las pistas apuntaban a Coleta Cris: entregó las actas para salvar su puesto. Juan José juega en paz. Coleta firma su dimisión frente a las cámaras.' },
  sinpruebas: { title: 'SOSPECHA SIN PRUEBAS', text: 'Señalaste a Coleta sin pruebas suficientes. El comité la defiende y el caso se archiva en silencio. La verdad sigue en la red.' },
  falsa: { title: 'LA PISTA FALSA', text: 'Señalaste a la persona equivocada. Mientras el comité discute, la verdadera filtradora sigue en su puesto.' },
  ceo: { title: 'EL CEO DEL AÑO', text: 'Descubriste la operación completa. Juan José consiguió jugar en paz. Codicia sobrevivió con un comunicado impecable y una silla nueva.' },
  imperio: { title: 'EL IMPERIO CAE', text: 'Las decisiones se acumularon. Codicia colapsó entre titulares, PowerPoints y un servidor que nadie supo apagar.' },
  encubrimiento: { title: 'EL GRAN ENCUBRIMIENTO', text: 'Borraste lo que no convenía. Juan José juega tranquilo. Tú te quedas con el silencio y una carpeta vacía.' },
  orden: { title: 'TODO ESTABA EN ORDEN', text: 'No se demostró ninguna irregularidad. La reputación de Codicia, en cambio, quedó destruida.' },
  rrhh: { title: 'FINAL SECRETO — RECURSOS HUMANOS', text: 'Recursos Humanos sabía desde el principio. Aprobó las vacaciones, firmó el memorándum y pidió que nadie preguntara.' }
};

// Decide el final a partir del estado. Pura: se puede probar sin navegador.
function chooseEnding(s) {
  if (s.hr && s.revealed) return 'rrhh';
  if (s.cover) return 'encubrimiento';
  if (s.accuse === 'Coleta Cris' && s.proofs >= 2) return 'verdad'; // una acusación probada vence al caos
  if (s.chaos >= 80) return 'imperio';
  if (s.accuse === 'Coleta Cris') return 'sinpruebas';
  if (s.accuse) return 'falsa';
  if (s.evidence < 2) return 'orden';
  return 'ceo';
}

// Noticias del ticker. Se filtran por nivel de caos.
const NEWS_BASE = [
  'Codicia cae un 2% tras la renuncia de su CEO.',
  'Coleta Cris pide calma en un comunicado de tres líneas.',
  'El Congreso no tiene fecha para la audiencia.',
  'Superspeed niega cualquier vínculo... por ahora.',
  'Un analista dice que todo es «una reestructuración estratégica».',
  'La investigación continúa.'
];
const NEWS_HIGH = [
  '¡ÚLTIMA HORA! El CEO desaparecido vuelve a ser tendencia.',
  'China rechaza acusaciones; las redes sociales hacen lo suyo.',
  'Se ha detectado actividad sospechosa en el calendario del CEO.',
  'El departamento de relaciones públicas solicita vacaciones.'
];
// Avisos aleatorios durante la partida. Solo son ambientación: no cambian estadísticas.
const EVENTS = [
  'Se ha caído la red del piso 3. Nadie puede enviar correos.',
  'Un becario pide una foto con el CEO. Denegado.',
  'La máquina del café pide revisión por tercera vez esta semana.',
  'Recursos Humanos envía una encuesta sobre el ambiente laboral. Obligatoria.',
  'Alguien dejó una nota en la impresora: «NO IMPRIMIR EL PLAN».',
  'La luz del pasillo parpadea. Alguien acaba de salir de esta planta.',
  'Un correo sin remitente: «Mira la fecha del contrato».',
  'Alguien ha tocado tu escritorio. El cajón está abierto.'
];
const NEWS_SAT = [
  'No es corrupción, es networking.',
  'El servidor está caído. Curiosamente, también lo está nuestra reputación.',
  '¿Tenemos pruebas? Tenemos un PowerPoint.'
];

// Fechas de las pistas (se muestran en el caso y en la línea del tiempo).
const CLUE_DATES = {
  rrhh: '2 nov', contrato: '3 nov', consejo: '12 nov', calendario: '14 nov', reuniones: '17 nov',
  registro: '18 nov · 2:13 a. m.', filtracion: '19 nov', servidor: '19 nov', teo: '19 nov',
  cruce1: '18 nov', cruce2: '12 nov', cruce3: '14 nov'
};

// Línea del tiempo del caso, en orden. «c» es la pista que la revela (null = hecho público).
const TIMELINE = [
  { d: '2 nov', t: 'Recursos Humanos aprueba las vacaciones de J. J. «sin preguntas».', c: 'rrhh' },
  { d: '3 nov', t: 'Firma del contrato con Superspeed. La fecha queda sin revisar.', c: 'contrato' },
  { d: '12 nov', t: 'El consejero Rovira sabe de la renuncia antes de anunciarla.', c: 'consejo' },
  { d: '14 nov', t: 'Reunión de las 10:00 en la sala 3, a nombre de Juan José.', c: 'calendario' },
  { d: '17 nov', t: 'Coleta reserva una reunión marcada con «Diario Nocturno».', c: 'reuniones' },
  { d: '18 nov', t: '2:13 a. m.: entra la tarjeta de la CEO interina en el servidor.', c: 'registro' },
  { d: '19 nov', t: 'Las actas aparecen en la prensa. Alguien copió el servidor.', c: 'filtracion' },
  { d: '20 nov', t: 'Juan José renuncia como CEO, presidente y miembro del consejo.', c: null },
  { d: '18 dic', t: 'Lanzamiento de GRA (6). Juan José tiene fecha en el calendario.', c: null }
];

// Pares de pistas que se contradicen o se completan: cruzarlas revela una pista nueva.
const CROSS = [
  { a: 'registro', b: 'teo', id: 'cruce1', suspect: 'Teo Ixcol', text: 'La tarjeta de Coleta entró a las 2:13, pero las actas salieron por el sistema de Teo. Alguien los usó juntos.' },
  { a: 'contrato', b: 'consejo', id: 'cruce2', suspect: 'Consejero Rovira', text: 'Rovira cambió la fecha del contrato para que coincidiera con la renuncia.' },
  { a: 'calendario', b: 'reuniones', id: 'cruce3', suspect: 'Coleta Cris', text: 'La reunión de las 10:00 no era de Juan José: coincide con la agenda de Coleta. Alicia sólo sirvió de tapadera.' }
];

// Pregunta guía de cada capítulo: el objetivo siempre está a la vista, el cómo es libre.
const QUESTIONS = [
  '¿Por qué Juan José desaparece justo cuando empieza la investigación?',
  '¿Quién puede abrir los archivos borrados sin dejar rastro?',
  '¿Qué ocultan las actas que el Congreso quiere ver?',
  '¿Quién gana si Codicia cae en bolsa?',
  '¿A quién se entregaron las actas, y por qué?'
];

if (typeof module !== 'undefined') module.exports = { CHAPTERS, ACTIONS, ACHIEVEMENTS, ENDINGS, chooseEnding, NEWS_BASE, NEWS_HIGH, NEWS_SAT, TIMELINE, CROSS, QUESTIONS, CLUE_DATES };
