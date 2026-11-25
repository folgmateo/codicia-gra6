# CODICIA: OPERACIÓN GRA (6)

Juego de misterio y oficina en pixel art, en el navegador. Sin instalación ni dependencias: HTML, CSS y JavaScript puro.

**Jugar en línea:** https://folgmateo.github.io/codicia-gra6/

## Cómo ejecutarlo en tu equipo

- Opción simple: abre `index.html` con el navegador.
- Opción recomendada: en la carpeta del juego, ejecuta `python -m http.server 8000` y entra en http://localhost:8000.

## Controles

| Tecla | Acción |
|---|---|
| WASD o flechas | Moverse |
| E, espacio o Enter | Interactuar y avanzar el diálogo |
| 1 a 9 | Elegir una opción en un diálogo |
| I | Inventario |
| J | Misiones y pregunta guía del capítulo |
| C | Caso: pistas agrupadas por sospechoso, y cruce de pistas |
| T | Línea del tiempo del caso |
| ESC | Pausa (continuar, guardar y salir al menú, ajustes) |

En móvil aparecen botones en pantalla.

## Qué hay

**Historia.** Juan José, CEO de Codicia, renuncia de golpe el 20 de noviembre de 2026. Coleta Cris queda como CEO interina y la investigación empieza. Lo que se descubre: un plan para dejar el puesto y jugar el lanzamiento de GRA (6) el 18 de diciembre, y una filtración de actas a la prensa.

**Cinco capítulos**, cada uno con una pregunta guía en MISIONES:
1. El CEO se fue a almorzar: el despacho de Juan José.
2. 404, confianza no encontrada: la sala de servidores.
3. El Congreso quiere hablar contigo: audiencia y declaración.
4. El mercado no tiene paciencia: consejo, prensa y servidores.
5. El verdadero negocio: la sala secreta y la acusación final.

**Mecánicas de investigación:**
- **Reloj por capítulo:** cada acción gasta minutos. Si se acaba, la vigilancia sube una vez.
- **Pistas con fecha:** se guardan en el caso (C) con su sospechoso.
- **Cruzar pistas:** en el caso eliges dos pistas; si se contradicen o se completan, aparece una pista nueva.
- **Línea del tiempo (T):** los hechos aparecen cuando encuentras la pista que los revela.
- **Acusación final:** en el capítulo 5 señalas al filtrador. Hay cinco finales según la acusación y las pruebas.

**Minijuegos:** auditoría (clasificar documentos), recuperar archivos (repetir secuencias de luces), contraseña (tipo Mastermind), interrogatorio en la audiencia, gestión de crisis, ventanas emergentes y bandeja de correo.

**Finales:** El CEO del año, El imperio cae, El gran encubrimiento, Todo estaba en orden, Recursos Humanos (secreto), La filtradora, Sospecha sin pruebas y La pista falsa. Se ven en la galería.

**Logros:** siete, en la sección LOGROS.

**Guardado:** la partida se guarda sola en el navegador. CONTINUAR la retoma. Los logros y finales se guardan aparte.

**Cuenta regresiva:** en el menú y en el HUD aparece la cuenta hasta el 18 de diciembre de 2026. La fecha está en `config.js`.

## Estructura de archivos

- `index.html`: página y elementos de la interfaz.
- `style.css`: estilos.
- `config.js`: fecha de lanzamiento y claves de guardado.
- `story.js`: capítulos, diálogos, acciones, pistas, línea del tiempo, cruces, finales.
- `minigames.js`: los siete minijuegos.
- `ui.js`: diálogos, paneles, menús, caso, HUD y audio.
- `game.js`: motor (mapa, movimiento, dibujo, flujo de capítulos y final).
- `tests.js`: pruebas de Node.

## Pruebas

```
node tests.js
```

Comprueban los finales, el contador, el Mastermind, que cada mapa mida 20 columnas, que todo objeto y personaje sea alcanzable desde el inicio, y que las pistas tengan fecha.

## Pendiente

- Reescribir los diálogos de los cinco capítulos para más detalle y misterio.
- Juego completo probado a mano por personas. Hasta ahora se probó con un recorrido automático.
- Audio, controles táctiles y diseño en móvil, sin comprobar.
- Juan José no aparece durante la partida: su diálogo final existe pero nunca se muestra en el mapa.
- Los finales CEO, Orden y Encubrimiento solo se han probado con las pruebas de Node, no en el navegador.
