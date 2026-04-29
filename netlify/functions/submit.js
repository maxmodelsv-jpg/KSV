// Netlify Function: принимает заявку с лендинга KSV и шлёт её
// владельцу в Telegram через Bot API.
// Env vars (Netlify → Site settings → Build & deploy → Environment):
//   BOT_TOKEN          — токен от @BotFather
//   TELEGRAM_CHAT_ID   — id чата владельца (личка или группа)
//   RATE_LIMIT_WINDOW  — окно в секундах (по умолчанию 60)
//   RATE_LIMIT_MAX     — макс. заявок с одного IP в окне (по умолчанию 3)

const rateBuckets = new Map();

const escapeHtml = (s = '') =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const normalizePhone = (s = '') => String(s).replace(/[^\d+]/g, '');

const takeBucket = (ip, windowSec, maxHits) => {
  const now = Date.now();
  const windowMs = windowSec * 1000;
  const bucket = rateBuckets.get(ip) || [];
  const recent = bucket.filter((t) => now - t < windowMs);
  if (recent.length >= maxHits) {
    rateBuckets.set(ip, recent);
    return false;
  }
  recent.push(now);
  rateBuckets.set(ip, recent);
  return true;
};

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, body: JSON.stringify({ ok: false, error: 'bad_json' }) };
  }

  if (payload.website) {
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  }

  const name = String(payload.name || '').trim().slice(0, 120);
  const phone = normalizePhone(payload.phone).slice(0, 20);
  const device = String(payload.device || '').trim().slice(0, 60);
  const problem = String(payload.problem || '').trim().slice(0, 2000);
  const source = String(payload.source || 'unknown').trim().slice(0, 30);
  const utm = payload.utm && typeof payload.utm === 'object' ? payload.utm : {};

  if (!name || phone.length < 10) {
    return { statusCode: 400, body: JSON.stringify({ ok: false, error: 'invalid_fields' }) };
  }

  const ip =
    event.headers['x-nf-client-connection-ip'] ||
    event.headers['x-forwarded-for']?.split(',')[0].trim() ||
    'unknown';

  const windowSec = Number(process.env.RATE_LIMIT_WINDOW || 60);
  const maxHits = Number(process.env.RATE_LIMIT_MAX || 3);
  if (!takeBucket(ip, windowSec, maxHits)) {
    return { statusCode: 429, body: JSON.stringify({ ok: false, error: 'rate_limited' }) };
  }

  const token = process.env.BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.error('submit: BOT_TOKEN or TELEGRAM_CHAT_ID missing');
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: 'not_configured' }) };
  }

  const utmLines = Object.entries(utm)
    .filter(([k, v]) => k.startsWith('utm_') && v)
    .map(([k, v]) => `<code>${escapeHtml(k)}</code>: ${escapeHtml(String(v))}`)
    .join('\n');

  const lines = [
    '🔔 <b>Новая заявка · KSV</b>',
    '',
    `👤 Имя: <b>${escapeHtml(name)}</b>`,
    `📞 Телефон: <a href="tel:${escapeHtml(phone)}">${escapeHtml(phone)}</a>`,
  ];
  if (device) lines.push(`📱 Устройство: ${escapeHtml(device)}`);
  if (problem) lines.push('', '📝 Проблема:', escapeHtml(problem));
  if (utmLines) lines.push('', '📊 UTM:', utmLines);
  lines.push('', `🕒 ${new Date().toISOString()}`);

  const text = lines.join('\n');

  try {
    const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });
    const tgBody = await tgRes.json().catch(() => ({}));
    if (!tgRes.ok || !tgBody.ok) {
      console.error('telegram error', tgRes.status, tgBody);
      return { statusCode: 502, body: JSON.stringify({ ok: false, error: 'telegram_failed' }) };
    }
  } catch (err) {
    console.error('fetch error', err);
    return { statusCode: 502, body: JSON.stringify({ ok: false, error: 'telegram_unreachable' }) };
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ok: true }),
  };
};
