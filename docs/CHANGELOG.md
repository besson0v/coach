# CHANGELOG.md

Хронология изменений проекта Coach.

Формат записи:
- дата / время
- commit
- что сделано
- зачем сделано
- какие файлы/слои затронуты
- как откатиться

---

## 2026-03-31 — bootstrap
- commit: `cb9a211`
- Что сделано:
  - создан каркас проекта Coach;
  - заведены папки `app/`, `docs/`, `infra/`, `storage/`;
  - добавлен bootstrap backend на Node.js;
  - добавлен базовый `docker-compose.yml`;
  - описана стартовая архитектура.
- Зачем:
  - нужен управляемый старт проекта с понятной структурой.
- Затронуто:
  - backend bootstrap
  - docker skeleton
  - проектная документация
- Откат:
  - откатиться к первому commit проекта или восстановить snapshot из `backups/`.

## 2026-04-01 — bot bootstrap
- commit: `pending`
- Что сделано:
  - добавлен минимальный Telegram bot layer (`app/src/bot.js`);
  - добавлены `/start`, `/app`, `/help`;
  - добавлена web app кнопка на текущий Coach URL;
  - добавлен `.env.example`;
  - docker-compose расширен сервисом `coach-bot`.
- Зачем:
  - нужен первый живой бот в Telegram, а не только сайт и backend scaffold.
- Затронуто:
  - Telegram bot polling
  - env config
  - docker runtime
- Откат:
  - откатиться к предыдущему commit без bot layer или восстановить bootstrap snapshot.
