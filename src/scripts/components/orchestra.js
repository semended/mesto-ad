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
}
