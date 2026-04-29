// Cloudflare Worker entry — обслуживает статику + endpoint /submit для формы
// Маршрутизация:
//   POST /submit → функция отправки заявки в Telegram
//   всё остальное → статические файлы из корня репозитория

import { onRequestPost } from '../functions/submit.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Endpoint формы заявки
    if (url.pathname === '/submit') {
      if (request.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
      }
      return onRequestPost({ request, env, ctx });
    }

    // Редирект /privacy → /#privacy
    if (url.pathname === '/privacy') {
      return Response.redirect(new URL('/#privacy', url.origin), 301);
    }

    // Всё остальное — статические ассеты
    return env.ASSETS.fetch(request);
  },
};
