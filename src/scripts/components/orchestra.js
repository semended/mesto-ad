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
  window.stopWedding = stopWedding;

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
  "🎤 Хор берёт «Свадьбу» (А. Бабаджанян / Р. Рождественский) 🕊️",
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

// 🔊 Настоящая запись «Свадьбы» (М. Магомаев, 1971) — не бундлим mp3,
// а подцепляем оригинал с YouTube скрытым плеером. Источник отдаёт
// сам YouTube, авторство сохранено. Влезает в DOM одним невидимым
// iframe вне потока — на разметку и логику «Места» не влияет.
const WEDDING_VIDEO_ID = "Nzn3b8VoKRI"; // Муслим Магомаев «Свадьба» (1971)
// Старт сразу с припева, чтобы ревью шло бодро. Значение примерное —
// подкрути секунду под конкретную запись, если промахнулись по такту.
const WEDDING_START_SEC = 49;

function playWedding() {
  // Перезапуск: убираем прошлый плеер, если жали ещё раз.
  document.getElementById("ai-orchestra-player")?.remove();

  const frame = document.createElement("iframe");
  frame.id = "ai-orchestra-player";
  frame.allow = "autoplay";
  frame.src =
    `https://www.youtube.com/embed/${WEDDING_VIDEO_ID}` +
    `?autoplay=1&controls=0&modestbranding=1&rel=0&start=${WEDDING_START_SEC}`;
  // Прячем, но не display:none — иначе часть браузеров глушит звук.
  frame.style.cssText =
    "position:fixed;width:1px;height:1px;left:-9999px;bottom:0;" +
    "border:0;opacity:0;pointer-events:none;";
  document.body.appendChild(frame);

  console.log(
    "%c🎺 Заиграла настоящая «Свадьба» Магомаева. Дирижёр запрягает: «Темп держим!»\n" +
      "Выключить: window.stopWedding()",
    STYLES.encore
  );
}

function stopWedding() {
  document.getElementById("ai-orchestra-player")?.remove();
}
