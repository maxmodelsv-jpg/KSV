// Cloudflare Pages Function: принимает заявку с лендинга KSV
// и шлёт её владельцу в Telegram через Bot API.
//
// Эндпоинт: POST /submit
//
// Env vars (Cloudflare Pages → Settings → Environment variables):
//   BOT_TOKEN          — токен от @BotFather
//   TELEGRAM_CHAT_ID   — id чата владельца (личка или группа)
//   ALLOWED_ORIGINS    — список доменов через запятую (по умолчанию основной + www)
//   RATE_LIMIT_WINDOW  — окно в секундах (по умолчанию 60)
//   RATE_LIMIT_MAX     — макс. заявок с одного IP в окне (по умолчанию 3)

const rateBuckets = new Map();

const DEFAULT_ALLOWED_ORIGINS = [
  'https://ksv-service.pro',
  'https://www.ksv-service.pro',
];

const ALLOWED_DEVICES = ['Телефон', 'Планшет', 'Ноутбук', 'Принтер или МФУ', 'Другое', ''];
const PHONE_RE = /^\+?7\d{10}$/;
const NAME_RE = /^[A-Za-zА-ЯЁа-яё\s\-'.]{2,60}$/;

const escapeHtml = (s = '') =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

// Удаляем управляющие, zero-width и RTL-override символы
const sanitizeText = (s = '') =>
  String(s).replace(/[ --​-‏‪-‮﻿]/g, '').trim();

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

const checkOrigin = (request, env) => {
  const allowedRaw = env.ALLOWED_ORIGINS;
  const allowed = allowedRaw
    ? allowedRaw.split(',').map((s) => s.trim()).filter(Boolean)
    : DEFAULT_ALLOWED_ORIGINS;
  const origin = (request.headers.get('origin') || request.headers.get('referer') || '').toLowerCase();
  if (!origin) return false;
  // Cloudflare preview/dev URLs
  if (origin.includes('.pages.dev')) return true;
  if (origin.includes('.workers.dev')) return true;
  return allowed.some((a) => origin.startsWith(a.toLowerCase()));
};

const json = (status, data) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

export async function onRequestPost(context) {
  const { request, env } = context;

  if (!checkOrigin(request, env)) {
    return json(403, { ok: false, error: 'forbidden_origin' });
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json(400, { ok: false, error: 'bad_json' });
  }

  if (payload.website) {
    return json(200, { ok: true });
  }

  const name = sanitizeText(payload.name).slice(0, 120);
  const phone = normalizePhone(payload.phone).slice(0, 20);
  const device = sanitizeText(payload.device).slice(0, 60);
  const problem = sanitizeText(payload.problem).slice(0, 2000);
  const source = sanitizeText(payload.source || 'unknown').slice(0, 30);
  const consent = payload.consent === true || payload.consent === 'on' || payload.consent === '1';
  const utm = payload.utm && typeof payload.utm === 'object' ? payload.utm : {};

  if (!consent) return json(400, { ok: false, error: 'consent_required' });
  if (!NAME_RE.test(name)) return json(400, { ok: false, error: 'invalid_name' });
  if (!PHONE_RE.test(phone)) return json(400, { ok: false, error: 'invalid_phone' });
  if (!ALLOWED_DEVICES.includes(device)) return json(400, { ok: false, error: 'invalid_device' });

  const ip =
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    'unknown';

  const windowSec = Number(env.RATE_LIMIT_WINDOW || 60);
  const maxHits = Number(env.RATE_LIMIT_MAX || 3);
  if (!takeBucket(ip, windowSec, maxHits)) {
    return json(429, { ok: false, error: 'rate_limited' });
  }

  const token = env.BOT_TOKEN;
  const chatId = env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.error('submit: BOT_TOKEN or TELEGRAM_CHAT_ID missing');
    return json(500, { ok: false, error: 'not_configured' });
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
      console.error('telegram error', tgRes.status, tgBody.error_code, tgBody.ok);
      return json(502, { ok: false, error: 'telegram_failed' });
    }
  } catch (err) {
    console.error('fetch error', err.name, err.message?.slice(0, 100));
    return json(502, { ok: false, error: 'telegram_unreachable' });
  }

  return json(200, { ok: true });
}

// Любой не-POST метод
export async function onRequest(context) {
  return new Response('Method Not Allowed', { status: 405 });
}
