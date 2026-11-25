// Configuración editable. La fecha del lanzamiento ficticio vive aquí y solo aquí.
const CONFIG = {
  LAUNCH_DATE: '2026-12-18T00:00:00', // hora local
  SAVE_KEY: 'codicia-gra6-progreso-v1',  // progreso de la partida actual
  META_KEY: 'codicia-gra6-meta-v1'       // logros, finales y ajustes: persisten entre partidas
};

// Partes del contador a partir de un instante (ms) y la fecha de lanzamiento (ISO).
function countdownParts(now, launchIso) {
  const ms = new Date(launchIso).getTime() - now;
  if (ms <= 0) return { passed: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
  const s = Math.floor(ms / 1000);
  return {
    passed: false,
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60
  };
}

function countdownText(p) {
  if (p.passed) return 'JUAN JOSÉ YA ESTÁ JUGANDO';
  const two = n => String(n).padStart(2, '0');
  return p.days + 'd ' + two(p.hours) + ':' + two(p.minutes) + ':' + two(p.seconds);
}

if (typeof module !== 'undefined') module.exports = { CONFIG, countdownParts, countdownText };
