import fs from 'node:fs';
import path from 'node:path';

const token = process.env.TELEGRAM_BOT_TOKEN;
const webAppUrl = process.env.COACH_WEBAPP_URL || 'https://besson0v.github.io/web/medtrack/';
const ownerId = process.env.TELEGRAM_OWNER_ID ? Number(process.env.TELEGRAM_OWNER_ID) : null;
const stateDir = path.resolve(process.cwd(), 'data');
const offsetFile = path.join(stateDir, 'bot-offset.json');

if (!token) {
  console.error('TELEGRAM_BOT_TOKEN is required');
  process.exit(1);
}

fs.mkdirSync(stateDir, { recursive: true });

function readOffset() {
  try {
    const raw = JSON.parse(fs.readFileSync(offsetFile, 'utf8'));
    return Number(raw.offset) || 0;
  } catch {
    return 0;
  }
}

function writeOffset(offset) {
  fs.writeFileSync(offsetFile, JSON.stringify({ offset }, null, 2));
}

async function tg(method, body = undefined) {
  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined
  });

  const json = await response.json();
  if (!json.ok) {
    throw new Error(`${method} failed: ${JSON.stringify(json)}`);
  }
  return json.result;
}

async function setupBot() {
  await tg('setMyCommands', {
    commands: [
      { command: 'start', description: 'Запустить Coach' },
      { command: 'app', description: 'Открыть Coach' },
      { command: 'help', description: 'Что умеет Coach' }
    ]
  });

  await tg('setChatMenuButton', {
    menu_button: {
      type: 'web_app',
      text: 'Coach',
      web_app: { url: webAppUrl }
    }
  });
}

function startText() {
  return [
    'Coach на связи.',
    '',
    'Пока это ранний черновик, но уже можно открыть mini app.',
    '',
    'Дальше сюда приедут:',
    '• лог тренировок',
    '• приём PDF и документов',
    '• разбор симптомов и анализов',
    '• история и динамика'
  ].join('\n');
}

function helpText() {
  return [
    'Сейчас доступны:',
    '• /start — запуск',
    '• /app — открыть Coach',
    '• /help — эта справка',
    '',
    'Следующий этап — приём текста и файлов с автоматической раскладкой.'
  ].join('\n');
}

async function sendApp(chatId, text) {
  return tg('sendMessage', {
    chat_id: chatId,
    text,
    reply_markup: {
      inline_keyboard: [[
        {
          text: 'Открыть Coach',
          web_app: { url: webAppUrl }
        }
      ]]
    }
  });
}

async function handleMessage(message) {
  const chatId = message.chat?.id;
  if (!chatId) return;

  if (ownerId && message.from?.id !== ownerId) {
    await tg('sendMessage', {
      chat_id: chatId,
      text: 'Coach пока закрыт на настройку.'
    });
    return;
  }

  const text = String(message.text || '').trim();

  if (text === '/start' || text.startsWith('/start ')) {
    await sendApp(chatId, startText());
    return;
  }

  if (text === '/app') {
    await sendApp(chatId, 'Открывай. Это текущий вход в Coach.');
    return;
  }

  if (text === '/help') {
    await tg('sendMessage', { chat_id: chatId, text: helpText() });
    return;
  }

  await tg('sendMessage', {
    chat_id: chatId,
    text: 'Пока я в стадии сборки. Уже скоро сюда можно будет писать тренировки, симптомы и кидать PDF.'
  });
}

async function pollLoop() {
  let offset = readOffset();
  while (true) {
    try {
      const updates = await tg('getUpdates', {
        timeout: 30,
        offset,
        allowed_updates: ['message']
      });

      for (const update of updates) {
        offset = update.update_id + 1;
        writeOffset(offset);
        if (update.message) {
          await handleMessage(update.message);
        }
      }
    } catch (error) {
      console.error('[coach-bot]', error.message);
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }
}

await setupBot();
console.log('Coach bot polling started');
await pollLoop();
