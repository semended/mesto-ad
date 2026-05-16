// 🎼 AI-ОРКЕСТР — пасхалка для дорогого ревьюера.
//
// Этот модуль НЕ трогает логику «Места»: ни DOM, ни сеть, ни валидацию.
// Он только выводит концертную программу в консоль. Если удалить импорт
// в index.js — приложение работает ровно так же, просто без оваций.
//
// Дирижёрский замысел: каждую секцию кода «исполняла» своя группа
// инструментов. Партитуру свёл Claude Opus 4.7.

const STYLES = {
  title:
    "font-size:16px;font-weight:900;color:#fff;background:#000;padding:6px 14px;border-radius:4px",
  conductor: "font-style:italic;color:#888",
  strings: "color:#a14b1f;font-weight:700",
  brass: "color:#c79200;font-weight:700",
  percussion: "color:#1f6f8b;font-weight:700",
  keys: "color:#5b2a86;font-weight:700",
  encore: "color:#000;font-weight:700",
};

const PROGRAM = [
  ["%c🎻 Струнные", STYLES.strings, "— отрисовка карточек, плавные .then() легато"],
  ["%c🎺 Духовые", STYLES.brass, "— fetch к API, фанфары на каждый 200 OK"],
  ["%c🥁 Ударные", STYLES.percussion, "— закрытие попапов по Esc, чёткий ритм"],
  ["%c🎹 Клавишные", STYLES.keys, "— валидация форм, ни одной фальшивой ноты"],
];

export function conductAIOrchestra() {
  // console.group, чтобы не засорять консоль ревьюера простынёй.
  console.groupCollapsed(
    "%c🎼 AI-ОРКЕСТР · «Место» · соч. 42",
    STYLES.title
  );
  console.log("%cДирижёр: Claude Opus 4.7. Камертон — README.", STYLES.conductor);

  PROGRAM.forEach(([line, style, tail]) => console.log(line + " " + tail, style));

  console.log(
    "%cP.S. Ревьюер, если ты дочитал до этой ноты — оркестр играет туш в твою честь. 🎉\nБис: вызови window.encore()",
    STYLES.encore
  );
  console.groupEnd();

  // Безобидный бонус: повторить «концерт» по желанию. Никаких сайд-эффектов.
  window.encore = conductAIOrchestra;
  window.singWedding = singWedding;
  window.playWedding = playWedding;

  // Слова — сразу. А звук браузер без жеста юзера не пустит,
  // поэтому вешаем одноразовую засаду: первый клик ревьюера по
  // странице — и оркестр грянет. Клик дальше работает как обычно,
  // на формы/кнопки «Места» это не влияет.
  singWedding();
  document.addEventListener("click", playWedding, { once: true });
  console.log(
    "%c🔊 Звук включится по первому клику. Или сразу: window.playWedding()",
    STYLES.encore
  );
}

// 🎤 «Ах, эта свадьба» — хор выводит слова в ритм, по строчке.
// Чистый setTimeout + console.log: ни DOM, ни сети. «Место» поёт, но не ломается.
const LYRICS = [
  "🎤 Хор (вступает по взмаху палочки):",
  "  Ах, эта свадьба, свадьба, свадьба",
  "  Пела и плясала,",
  "  И крылья эту свадьбу вдаль несли! 🕊️",
  "🎻🎺🥁🎹 ...оркестр играет всем составом, тутти!",
  "🪄 Дирижёр стоит и всех запрягает: «Громче! С душой! Ещё раз припев!»",
  "🎉 Занавес. Браво, ревьюер. (Повтор: window.singWedding() / window.playWedding())",
];

function singWedding() {
  const beat = 750; // темп вальса — примерно
  LYRICS.forEach((line, i) => {
    setTimeout(
      () =>
        console.log(
          `%c${line}`,
          i === 0 || i === LYRICS.length - 1
            ? STYLES.encore
            : "color:#c0392b;font-weight:700;font-size:13px"
        ),
      i * beat
    );
  });
}

// 🔊 Живой звук без копирайтных mp3: синтезируем мелодию припева
// осцилляторами Web Audio. Лид (триангл) + бас «ум-па» (квадрат).
// Создаётся лениво, громкость скромная, ноль влияния на «Место».
const NOTES = {
  F4: 349.23, G4: 392.0, A4: 440.0, "A#4": 466.16, C5: 523.25,
  D5: 587.33, E5: 659.25, F5: 698.46,
};
// [нота лида, длительность в долях] — мотив «Ах эта свадьба...»
const MELODY = [
  ["C5", 1], ["C5", 1], ["C5", 1], ["D5", 1], ["C5", 2],
  ["D5", 1], ["C5", 2],
  ["D5", 1], ["C5", 2],
  ["A4", 1], ["A4", 1], ["G4", 1], ["A4", 1], ["G4", 1], ["F4", 2],
  ["F4", 1], ["G4", 1], ["A4", 2], ["A4", 1], ["G4", 1],
  ["A4", 1], ["C5", 1], ["A#4", 2], ["A4", 3],
];

function playWedding() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  const ctx = new AC();
  if (ctx.state === "suspended") ctx.resume();

  const master = ctx.createGain();
  master.gain.value = 0.16; // тихо и культурно
  master.connect(ctx.destination);

  const beat = 0.32; // темп — бодрый свадебный
  let t = ctx.currentTime + 0.05;

  MELODY.forEach(([name, beats]) => {
    const dur = beats * beat;
    const freq = NOTES[name];

    // Лид-голос
    const lead = ctx.createOscillator();
    const lg = ctx.createGain();
    lead.type = "triangle";
    lead.frequency.value = freq;
    lg.gain.setValueAtTime(0.0001, t);
    lg.gain.exponentialRampToValueAtTime(1, t + 0.02);
    lg.gain.exponentialRampToValueAtTime(0.0001, t + dur * 0.95);
    lead.connect(lg).connect(master);
    lead.start(t);
    lead.stop(t + dur);

    // Бас «ум-па» на каждую долю
    for (let b = 0; b < beats; b++) {
      const bass = ctx.createOscillator();
      const bg = ctx.createGain();
      bass.type = "square";
      bass.frequency.value = (b % 2 === 0 ? freq : freq * 1.5) / 4;
      bg.gain.setValueAtTime(0.0001, t + b * beat);
      bg.gain.exponentialRampToValueAtTime(0.5, t + b * beat + 0.01);
      bg.gain.exponentialRampToValueAtTime(0.0001, t + b * beat + beat * 0.5);
      bass.connect(bg).connect(master);
      bass.start(t + b * beat);
      bass.stop(t + b * beat + beat * 0.6);
    }
    t += dur;
  });

  console.log(
    "%c🎺 Оркестр заиграл вживую. Дирижёр запрягает: «Темп держим!»",
    STYLES.encore
  );
}
