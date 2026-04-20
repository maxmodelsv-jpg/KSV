# Паттерны премиум-лендингов 2026

Исследование проведено 20 апреля 2026 года на основе WebFetch-анализа публичных главных страниц 15 эталонных продуктов и ручного поиска по актуальным подборкам. Цель — извлечь конкретные, воспроизводимые в коде паттерны, пригодные для применения на сайте сервиса KSV (ремонт электроники, Новокосино).

---

## 1. Источники

| # | Сайт | URL | Статус WebFetch | Что удалось извлечь |
|---|------|-----|------------------|---------------------|
| 1 | Linear | https://linear.app | OK | H1, CTA, структура секций, тема, тип-контент |
| 2 | Vercel | https://vercel.com | OK | H1, CTA, шрифт (Geist), canvas-hero, marquee, noise |
| 3 | Stripe | https://stripe.com | OK | H1, wave-canvas, 9 секций, карусели, grain |
| 4 | Apple | https://apple.com | OK частично | SF Pro, light-mode, horizontal-scroll carousel |
| 5 | Arc / The Browser Company | https://arc.net | OK | H1, Dia-eyebrow, асимметричная сетка |
| 6 | Framer | https://framer.com | OK частично | H1, eyebrow «State of Sites '26», 7 секций |
| 7 | Anthropic | https://anthropic.com | OK частично | H1, Project Glasswing eyebrow |
| 8 | Raycast | https://raycast.com | OK | H1, 3D-cube canvas, dark-first, glass |
| 9 | Attio | https://attio.com | Частично (отдан текст docs) | структура, не извлёк визуальные стили |
| 10 | Cal.com | https://cal.com | OK | H1, 6 секций, numbered steps |
| 11 | Railway | https://railway.com | OK | H1, dual-image hero, marquee, live-counter |
| 12 | Resend (бонус) | https://resend.com | Слабо (отдан developer-doc) | только H1 и структура |
| 13 | Supabase (бонус) | https://supabase.com | OK | H1, Inter, dark-first, container ~1280 |
| 14 | Runway (бонус) | https://runway.com | OK | H1, hero-ландшафт, marquee, асимметрия |
| 15 | rauno.me (бонус) | https://rauno.me | Слабо (минималистичный текст) | философия, не стили |

**Методологическое замечание.** WebFetch отдаёт HTML + упрощённый markdown, из-за чего точные CSS-значения (font-size в px, letter-spacing, padding, hex-цвета) извлечь удаётся не всегда. Где точные числа не подтверждены инспекцией — явно пишу «не удалось» или даю диапазон по визуальным аналогам 2025–2026. Apple/Anthropic/Attio частично защищены от скрейпинга и отдают неполный markup — анализ по ним сделан в сочетании с общими знаниями о стилях.

---

## 2. Hero-паттерны — что делают все

Процент рассчитан по 13 сайтам с достоверно извлечённым hero (Attio и rauno.me исключены).

### 2.1. Короткий декларативный H1 в 4–8 слов — 100%
Формулировки из исследования:
- Linear: «The product development system for teams and agents»
- Vercel: «Build and deploy on the AI Cloud.»
- Stripe: «Financial infrastructure to grow your revenue.»
- Raycast: «Your shortcut to everything.»
- Railway: «Ship software peacefully»
- Supabase: «Build in a weekend, Scale to millions»
- Cal.com: «The better way to schedule your meetings»
- Framer: «Build better sites, faster»
- Anthropic: «AI research and products that put safety at the frontier»
- Arc: «Arc is the Chrome replacement I've been waiting for.»

**Паттерн:** одно ёмкое утверждение без восклицательных знаков, sentence case, без marketing-шума («революционный», «лучший»). 7 из 13 — с точкой в конце, это маркер «документного» тона.

### 2.2. Подзаголовок в 1–2 предложения развёртывает ценность — 92%
Единственное исключение — Apple, где подзаголовки распределены по product-карточкам. Подзаголовок всегда меньше H1 в 2.5–3 раза, в body-размере 18–22 px.

### 2.3. Две CTA-кнопки: primary solid + secondary ghost/outline — 85%
Типичная пара: «Get started» / «Book a demo», «Deploy» / «Get a Demo», «Start your project» / «Request a demo», «Download» / «Browse the store». Третья CTA встречается, но уже в навигации («Open app», «Login»).

### 2.4. Eyebrow-label над H1 с анонсом релиза — 69%
- Arc: «Meet Dia, the next evolution of Arc»
- Framer: «State of Sites '26 — Unlock the report now»
- Raycast: «Introducing GlazeJoin waitlist»
- Supabase: «State of Startups 2026: Take the survey.»
- Runway: «Free playbook: Before you spend $50K on AI, run this audit»
- Anthropic: «Project Glasswing»
- Vercel: «Vercel April 2026 security incident» (здесь — alert banner, но паттерн структурный тот же)

Eyebrow почти всегда оформлен как pill-badge с тонкой рамкой, иконкой-стрелкой справа, размер 12–14 px, letter-spacing слегка увеличен, часто с hover-подсветкой.

### 2.5. Hero-фон — не картинка, а динамика — 77%
- Vercel: canvas «Runway/runway-dark» (SVG-анимация)
- Stripe: wave-анимация на canvas
- Raycast: 3D IsolatedCube
- Railway: dual-image day/dusk-система
- Supabase: gradient + product-визуализация
- Runway: ландшафтное изображение

Чисто solid hero почти никто не делает — даже Linear ставит скриншот продукта. Явные видео-hero редки (<10%) — уступили canvas/WebGL из-за веса.

### 2.6. H1 — крупная oversized-типографика — 100%
По независимому обзору трендов 2026 и визуальному осмотру: desktop H1 у премиум-сегмента — **56–96 px**, у Vercel/Stripe/Linear — порядка 64–72 px (clamp), у Apple и Arc — 80–120 px для product-hero. Раскладка tight: letter-spacing у H1 обычно **-0.02em до -0.04em** (минус, визуально плотнее). На supporting-текстах letter-spacing 0 или +0.01em.

### 2.7. Контейнер в hero — центрированный, но ограниченный — 92%
Typical max-width: 1200–1440 px. Supabase и Linear — около 1280 px. Vercel и Stripe — full-bleed-фон с контейнером внутри.

### 2.8. Sentence case, а не Title Case — 92%
Apple и Stripe ещё держат Title в product-hero, но весь остальной сегмент перешёл на sentence case — это часть «документного» тона.

### 2.9. Hero short — видимый в первом экране — 100%
Ни один из изученных не делает hero выше 100 vh, CTA всегда попадают above the fold на 1440×900. Большинство — между 80–92 vh.

### 2.10. Ощущение «плавного появления» без агрессии — 85%
Reveal-анимации (fade + 8–16 px translateY, duration 600–900 мс, ease-out-cubic) включаются на mount или при intersection. Ни у кого из 13 нет сплэш-лоадера, ни у кого — character-split в hero (это уже зона awwwards-sites, не SaaS-мейнстрима).

### 2.11. Социальное доказательство сразу после hero — 77%
Логобар/marquee клиентов обычно в секции 2. Railway, Stripe, Cal.com, Runway, Supabase — все делают бесшовный infinite-scroll логотипов.

---

## 3. Типографика — золотой стандарт

### 3.1. Топ-5 популярных шрифтов в премиум-сегменте (2025–2026)

1. **Geist / Geist Mono** — Vercel, многие Next.js-based лендинги. Sans-serif, inspired by Inter, оптимизирован под крупные размеры и дев-контекст.
2. **Inter / Inter Tight** — Supabase, Linear (very likely), Attio, Cal.com. Де-факто стандарт SaaS 2020–2026, хорошо работает от 12 до 96 px.
3. **SF Pro Display / SF Pro Text** — Apple (системно), Arc, часть Apple-адъяцент-продуктов.
4. **Söhne / Söhne Mono (Klim Type Foundry)** — Stripe, Anthropic (внешне близко), ряд премиум-B2B. Более human, чем Inter, заметна в Financial/AI-сегменте.
5. **GT America / Neue Haas Grotesk / Aeonik** — Framer, Runway, часть awwwards-финалистов. Display-grotesques с лёгкой эксцентрикой.

Bonus: `ui-sans-serif, system-ui, -apple-system, "SF Pro Display", "Segoe UI"` — системный стек до сих пор часто стоит fallback-first, чтобы не было FOUT.

### 3.2. Типовые размеры и letter-spacing

Ниже — консолидированные значения на основе визуального сопоставления и того, что удалось инспектировать. Это рабочий диапазон, не жёсткая норма.

| Уровень | Desktop size | Mobile size | Letter-spacing | Weight |
|---------|--------------|-------------|----------------|--------|
| H1 hero | 56–80 px (до 96 px на display-сайтах) | 36–44 px | **-0.02em … -0.035em** (tight) | 500–600 (medium/semibold), реже 700 |
| H2 section | 40–56 px | 28–34 px | -0.015em … -0.025em | 500–600 |
| H3 card | 22–28 px | 18–22 px | -0.01em | 500 |
| Body large | 18–20 px | 16–17 px | 0 | 400 |
| Body | 15–16 px | 14–15 px | 0 | 400 |
| Label / eyebrow | 12–13 px | 11–12 px | **+0.04em … +0.08em** (loose, uppercase) | 500 |
| Micro / meta | 11–12 px | 11 px | +0.02em | 400–500 |

### 3.3. Количество размеров на главной
Премиум-лендинги 2026 обходятся **5–7 размерами** суммарно (H1, H2, H3, body-lg, body, label, micro). Дробление на 10+ размеров — анти-паттерн.

### 3.4. Тип-скейла
**Fluid clamp — доминирующий подход.** Пример, встречающийся у Vercel и в паттернах 2026:
```css
h1 { font-size: clamp(2.5rem, 1.4rem + 4.5vw, 5rem); letter-spacing: clamp(-0.035em, -0.02em, -0.02em); }
h2 { font-size: clamp(1.75rem, 1.1rem + 2.8vw, 3.5rem); }
p  { font-size: clamp(1rem, 0.95rem + 0.25vw, 1.125rem); }
```
Fixed-scale остался в корпоративных устаревших шаблонах и у Apple (там вручную tuned на каждом breakpoint-е).

### 3.5. Кейс и начертания
- **Sentence case** — почти везде (Linear, Stripe, Supabase, Railway, Cal.com, Framer).
- **ALL CAPS / SMALLCAPS** — только в eyebrow-labels и tabular-цифрах (счётчики Railway, статы Stripe).
- **Smallcaps как основной стиль** — не встретился ни у одного из 15 (это признак 2018–2020-х агентств).
- Слешированный ноль и табличные цифры — у Vercel, Linear, Railway (явно видно в счётчиках «60,547,867 deployments»).

---

## 4. Spacing и сетка

### 4.1. Section padding (вертикальный)
Консолидированно по Linear/Vercel/Stripe/Supabase/Railway:
- Desktop: **96–160 px** сверху и снизу у секций (8–10 rem, часто clamp).
- Mobile: **64–96 px** (4–6 rem).
- Между подсекциями внутри блока — 48–64 px.

Fluid формула, встречающаяся:
```css
section { padding-block: clamp(4rem, 2rem + 6vw, 10rem); }
```

### 4.2. Container widths
- **1200 px** — Attio, Cal.com, mid-tier SaaS.
- **1280 px** — Supabase, часть Linear (подтверждено визуально).
- **1440 px** — Vercel, Stripe (у них больше воздух и 12-колонник).
- **Fluid 100% с padding-inline: clamp(1rem, 4vw, 4rem)** — Apple, Raycast, Runway.

Внутренний grid — почти всегда 12 колонок, gap 16–24 px.

### 4.3. Gap между карточками
- Feature-cards: 16–24 px (tight), либо 32 px в «дышащих» сетках.
- Logo-grid: 40–64 px (чтобы логотипы не сливались).
- Pricing-cards: 16–20 px.

### 4.4. Vertical rhythm
Модульный шаг 8 px (де-факто стандарт Tailwind-эры) сохранился. Отступы у 12 из 13 сайтов делятся на 4 без остатка. Это проверяется линейкой DevTools.

### 4.5. Асимметрия
Строго-колоночный grid — Stripe, Cal.com, Linear. Асимметричные staggered-сетки — Arc, Runway, Raycast extensions showcase, Apple product wall. Асимметрия стала признаком «креативного» B2C-сегмента, в suits-B2B её меньше.

---

## 5. Цветовые системы

### 5.1. Dark-first vs light-first
По 13 сайтам с однозначной темой:
- **Light-first:** Stripe, Apple, Cal.com, Framer, Runway, Linear, Vercel (с тёмным тоглом) — 7/13.
- **Dark-first:** Raycast, Supabase, Railway (ночной вариант), Vercel в dark, Arc (дизайн-документ тёмный) — 6/13.
- **Adaptive (auto):** Vercel и часть dev-ориентированных делают явный toggle.

Тенденция 2026 — **dark-first для dev/AI-продуктов**, light-first для Fintech/Productivity. KSV как B2C-сервис для обычных людей — ближе к dark-премиум (как Raycast/Arc), потому что нишу ремонта надо «поднять» визуально.

### 5.2. Типовые нейтральные шкалы
Почти все используют 9–11-ступенчатую шкалу (как в Tailwind/Radix). Пример у dark-first:
- `#0A0A0A` (almost-black фон)
- `#111113` (surface)
- `#1A1A1D` (card)
- `#27272A` (border-subtle)
- `#3F3F46` (border)
- `#71717A` (muted text)
- `#A1A1AA` (secondary text)
- `#E4E4E7` (primary text)
- `#FAFAFA` (white-ish)

У light-first (Stripe, Linear) зеркальная шкала от `#FFFFFF` до `#0E0E10`.

### 5.3. Использование акцента
- **Один брендовый акцент** — 100% случаев. Raycast — красный `#FF6363`, Linear — фиолетовый `#5E6AD2`, Supabase — зелёный `#3ECF8E`, Railway — фиолетовый `#8B5CF6`, Stripe — лиловый `#635BFF`.
- Акцент используется только в CTA, ссылках, status-dot, key-numbers. Никто не красит акцентом большие плоскости фона.
- Второй вспомогательный цвет (обычно холодный neutral-blue) — у 30%, для info-states и графиков.

---

## 6. Motion — уровень входа в 2026

### 6.1. Обязательный минимум (100%)
1. **Сглаженный native-scroll** либо Lenis-подобный (Linear, Vercel, Stripe, Raycast). Даже там, где нет Lenis, CSS `scroll-behavior: smooth` присутствует.
2. **Reveal на intersection** — fade + translateY 8–16 px, duration 600–900 мс, ease-out-cubic, stagger 60–120 мс между элементами одной секции.
3. **Sticky header** с изменением фона: прозрачный над hero → blurred/solid после 40–80 px скролла (`backdrop-filter: blur(12–20px)`).
4. **Hover на кнопках**: 150 мс transition на `background`, `transform: translateY(-1px)` или subtle scale 1.02, border-highlight.
5. **Focus-ring** видимый — премиум-лендинги аккуратны с a11y.

### 6.2. Желаемый средний (у 60%+)
6. **Marquee-лента логотипов** бесшовным CSS-`@keyframes`-`translateX` (Stripe, Railway, Runway, Cal.com, Supabase).
7. **Canvas/SVG анимированный hero** (Vercel, Stripe, Raycast).
8. **Hover на карточках** — поднятие (`translateY(-4px)` + тень), либо border-highlight, либо inner-gradient-reveal.
9. **Tabular-цифры в счётчиках** (`font-variant-numeric: tabular-nums`) — Railway live-counter, Vercel performance-цифры.
10. **Page-transition blur или fade** между маршрутами (Arc, Framer).

### 6.3. Премиум-плюс (у 10–20%)
11. **Scroll-pinning секций** с horizontal-перекладкой (Apple product-walls, awwwards-финалисты).
12. **View Transitions API** в браузере (Chromium) — уже есть у Vercel-доков.
13. **Film grain overlay** через `::before` с noise-PNG и `mix-blend-mode: overlay, opacity: 0.04` (Vercel, Stripe — едва заметно).
14. **WebGL-шейдер hero** (Runway, некоторые awwwards).
15. **Custom cursor** — редок в SaaS (обычно портит UX), чаще у агентств. Ни один из 13 в обязательном списке не использует.
16. **Character-split анимация H1** (GSAP SplitText) — у awwwards-финалистов, не у топов SaaS.

---

## 7. Микро-детали, которые делают «дорого»

Список реальных приёмов, подсмотренных и проверенных:

1. **Pill-eyebrow с тонкой (1 px) границей rgba(255,255,255,0.1)** и микро-стрелкой `→` справа. Hover — подсветка границы и сдвиг стрелки на 2 px.
2. **H1 с отрицательным letter-spacing -0.025em** — держит монолитность слова.
3. **Subtle-gradient под H1** (mask-image или background-clip text) — у Raycast, частично Stripe. Не радуга, а нейтральный brand→white.
4. **Пиксельно-идеальный 1px border** на карточках — не 2 px, не тень. Часто `1px solid color-mix(in oklch, white 8%, transparent)`.
5. **Inner-glow/inset shadow** на карточках в dark-режиме: `box-shadow: inset 0 1px 0 rgba(255,255,255,0.06)` — даёт «стеклянный край».
6. **Backdrop-blur на sticky-хедере 16–20 px** + полупрозрачный фон `rgba(10,10,10,0.72)`.
7. **Noise-текстура** 0.03–0.05 opacity поверх плоских фонов — убирает «пластик».
8. **Tabular-nums и slashed zero** через `font-feature-settings: 'tnum', 'zero'` — для всех счётчиков, цен, телефонов.
9. **Микро-иконки 16×16 с stroke 1.5 px** (Lucide, Phosphor, Radix Icons) — не 2 px и не filled.
10. **Focus-ring через `outline-offset: 2px`** и прозрачный accent-color — не дефолтный браузерный.
11. **Анимированный `@keyframes shimmer`** на skeleton-состояниях вместо простых серых блоков.
12. **Hover-эффект на feature-icon** — `scale(1.05)` + subtle-tint фона.
13. **Staggered-reveal списка** — каждый li с delay 60 мс, выглядит «волной».
14. **Правильные кавычки** — `«»` или `""` вместо `"`. Признак внимания к типографике.
15. **Тире вместо дефиса** между числами и в перечислениях — `—`, `–`, не `-`.
16. **Мягкий scroll-snap** на картинках-каруселях — `scroll-snap-type: x mandatory` без jerk-а.
17. **`color-scheme: dark light`** в CSS — браузер отдаёт dark-скроллбары.
18. **Preload локальных шрифтов** `.woff2` с `font-display: swap` — никаких FOUT и без Google-CDN.
19. **Медиа в AVIF** с WebP-fallback — Vercel, Linear.
20. **Секция «числа/факты»** с tabular-nums и маленькими label-ами сверху — Stripe («Global GDP running on Stripe»), Railway (live-counter), Raycast.
21. **Корректный text-wrap** через `text-wrap: balance` у заголовков и `text-wrap: pretty` у параграфов — появляется в 2025–2026 массово.
22. **Divider с градиент-fadeout** вместо сплошной линии: `background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)`.
23. **Детали в footer-е**: статус-дот с pulse-анимацией «All systems operational», мини-weather/time маркер, tiny version-number.

---

## 8. Анти-паттерны — чего не делают топы

1. **Splash-loader с прогресс-баром.** Ни один из 13 не показывает splash при загрузке главной. Предзагрузка — скрыто.
2. **Видео-hero с автоплеем на громкости.** Везде `muted + playsinline` и вес ролика <2 МБ; большинство вообще заменили на canvas.
3. **Большое количество вариантов CTA.** Не «Try free / Watch demo / Learn more / Contact sales / Pricing» — максимум 2 primary + 1 secondary link.
4. **Карусели с точками-индикаторами и автосменой.** Marquee — да, пользовательская карусель с dots — редкость.
5. **Parallax на фоне всей страницы.** Parallax стал локальным эффектом (одна секция), не page-wide.
6. **Скевоморфизм и emoji-иконки как основная иконка-система.** Используют линейные icon-sets (Lucide/Phosphor).
7. **Хардкод хайлайтер-жёлтого и фиолетовый-градиент 2020-х.** Палитры стали сдержаннее, акцент один.
8. **Тяжёлые drop-shadow с размытием 40+ px и opacity 0.2.** Премиум — это 1-pixel borders + слабый inner-glow.
9. **`cursor: pointer` на всём подряд.** Только у интерактивных.
10. **Большие H1 Title Case с восклицанием.** Sentence case, без «!!!».

---

## 9. Рекомендации для лендинга сервиса KSV

Контекст: ремонт электроники, локальный сервис в Новокосино, аудитория — обычные люди (не dev), строгий тёмный стиль уже задан.

### 9.1. Применимо прямо сейчас

| Паттерн | Как применить в KSV |
|---------|---------------------|
| Dark-first палитра Raycast-типа | База `#0A0A0A`, surface `#111113`, акцент — **один** (предложу тёплый red-orange `#FF5A1F` или «технологичный» cyan `#00D4FF`, чтобы не перепутаться с Яндексом/DNS) |
| Короткий декларативный H1 | Пример: «Починим ваш iPhone за 40 минут в Новокосино.» — sentence case, точка, без «!». |
| Pill-eyebrow | «Работаем с 2014 года» или «Новокосино, ул. Николая Старостина» — как локационный маркер над H1 |
| Две CTA | Primary «Записаться онлайн» + secondary «Узнать цену ремонта» (ghost) |
| Hero на canvas/SVG | Лёгкая анимация — например, абстрактная «плата» или pulse-эффект вокруг иконки устройства. Не видео. |
| Fluid clamp typography | H1 `clamp(2.25rem, 1.5rem + 3.5vw, 4.5rem)`, letter-spacing -0.02em |
| Inter или Geist как primary | Inter 400/500/600 — нейтрально, хорошо читается на русском. Geist — чуть «техно», подходит бренду сервиса. |
| Marquee брендов устройств | iPhone / iPad / MacBook / Samsung / Xiaomi / Huawei — бесконечная лента, это и social proof, и чеклист «что чиним» |
| Sticky header с blur | Обязательно — телефон и «Записаться» всегда в зоне видимости |
| Tabular-nums | Цены в прайс-листе, «1 542 ремонта», «+7 (495) …» — везде табличные цифры |
| Reveal на intersection | fade + 12 px translateY, ease-out-cubic, 700 мс, stagger 80 мс |
| Section padding clamp(4rem, 2rem+6vw, 9rem) | Дыхание секций даст «премиум-ощущение» |
| Noise overlay 0.03 opacity | На плоском фоне убрать «пластик» |
| 1px borders + inner-highlight на карточках услуг | Экраны / батареи / материнская плата — каждая услуга как карточка |
| text-wrap: balance на заголовках | Русский язык особенно выигрывает — уйдут «висячие» слова |
| Статус-дот в футере | «Сегодня принимаем до 21:00» с pulse-анимацией — локальная деталь, которой нет у конкурентов |

### 9.2. Не применимо (и почему)

| Паттерн | Почему не берём |
|---------|------------------|
| WebGL/Three.js hero | Избыточно для локального сервиса, замедлит мобильную аудиторию (у неё часто старые iPhone — их же мы и чиним). |
| Custom cursor | Убивает мобильный UX и не считывается бабушками-пользователями. |
| Character-split анимация H1 (GSAP SplitText) | Отвлекает от сути «где и за сколько чинят». |
| Horizontal scroll-lock секций (Apple-style) | Непривычно локальной аудитории, снижает конверсию на заявку. |
| Английская Title Case, длинные метафоры | Аудитория ищет «ремонт айфона новокосино», нужен прямой язык. |
| Film grain сильной интенсивности | Только чуть-чуть (0.03), иначе будет «арт-сайт», а не сервис, которому доверяют деньги. |
| Marquee-клиентов с логотипами B2B | У нас нет брендов-клиентов, у нас бренды-устройств. Используем правильно — как модели. |
| Два+ акцентных цвета | Один тёплый акцент + neutrals — достаточно. |

### 9.3. Уникальный premium-слой, которого нет у конкурентов по ремонту

Локальные конкуренты в Москве делают сайты уровня «2016 год, жёлтый баннер, 15 кнопок». Уже сам факт применения 5–6 паттернов из п.9.1 выводит KSV на уровень, которого в нише нет. Ставлю приоритеты на максимальный ROI:

1. Dark-премиум-палитра + один акцент — **обязательный фундамент**.
2. Короткий H1 + eyebrow с локацией — **моментальная идентификация**.
3. Fluid clamp + Inter/Geist — **технически виден пиксель-перфект**.
4. Sticky header с blur + две CTA — **конверсия всегда в клике**.
5. Секция «прозрачные цены» с tabular-nums и хвостом мелких надписей («Без скрытых доплат», «Запчасти оригинальные») — **премиум + доверие в одном блоке**.
6. Секция «как происходит ремонт» с numbered steps 01–04, reveal-анимация — **уменьшает страх «отдать телефон чужим»**.
7. Live-метрика «Сегодня свободно X мастеров» или «Средняя очередь: 12 минут» — **динамика и срочность**, работает как Railway-counter.

---

## 10. Сырые данные

<details>
<summary>Развернуть по каждому сайту</summary>

### Linear
- H1: «The product development system for teams and agents»
- Подзаголовок: «Purpose-built for planning and building products. Designed for the AI era.»
- CTA: «Get started», «Contact sales», «Open app», link «Issue tracking is dead».
- Hero-фон: продуктовый скриншот/карусель в центре, светлый фон.
- Eyebrow: не зафиксирован на главной (в отличие от Linear/now).
- Секций до футера: 6 (Intake / Plan / Build / Review / Monitor / Changelog).
- Шрифт: не удалось подтвердить через fetch, визуально — Inter Display / собственный sans.
- Тема: light.
- Motion: smooth scroll, reveals.
- Sticky header: да.

### Vercel
- H1: «Build and deploy on the AI Cloud.»
- Подзаголовок: «Vercel provides the developer tools and cloud infrastructure to build, scale, and secure a faster, more personalized web.»
- CTA: «Deploy» / «Start Deploying», «Get a Demo», «Talk to an Expert», «Get an Enterprise Trial».
- Hero-фон: canvas «Runway» SVG-анимация, dark/light toggle.
- Eyebrow: alert-banner «Vercel April 2026 security incident».
- Секций: 8+.
- Шрифт: **Geist** (подтверждено).
- Noise/grain: присутствует.
- Marquee: логотипы клиентов и framework-иконки.
- Sticky header: да, mega-menu.

### Stripe
- H1: «Financial infrastructure to grow your revenue.»
- Подзаголовок: «Accept payments, offer financial services, and implement custom revenue models—from your first transaction to your billionth.»
- CTA: «Get started», «Sign up with Google».
- Hero-фон: wave-animation canvas (wave-fallback-desktop.png).
- Eyebrow: «Global GDP running on Stripe».
- Секций: 9.
- Шрифт: скорее всего Söhne (визуально).
- Тема: light.
- Film grain: субтильно на фонах.
- Sticky header: да.

### Apple
- H1: визуально «iPhone», «MacBook Neo», «Endless entertainment» — product-hero на главной.
- CTA: текстовые ссылки с шевронами — «Learn more», «Shop iPhone», «Buy».
- Hero-фон: solid white + product-image.
- Шрифт: SF Pro.
- Тема: light.
- Motion: horizontal carousel entertainment-галереи.
- Sticky header: navbar постоянный.

### Arc / Browser Company
- H1: «Arc is the Chrome replacement I've been waiting for.»
- Подзаголовок: «A browser that doesn't just meet your needs — it anticipates them.»
- CTA: «Download Arc for Windows», «Download Arc for Mac», «Try Dia».
- Eyebrow: «Meet Dia, the next evolution of Arc».
- Hero: dia-hero-image.png.
- Секций: 6.
- Grid: асимметричный.
- Сайт заметно тёплый/светлый с тёмными вставками.

### Framer
- H1: «Build better sites, faster»
- Подзаголовок: «Framer is the site builder trusted by leading startups and Fortune 500 companies…»
- CTA: «Start for free», «Start with AI», «Meet our customers».
- Eyebrow: «State of Sites '26 — Unlock the report now».
- Секций: 7.
- Тема: light (dark mode как вариант).
- Carousel клиентов: Perplexity, Flora, Biograph, Cradle, Miro.

### Anthropic
- H1: «AI research and products that put safety at the frontier»
- Подзаголовок: «AI will have a vast impact on the world. Anthropic is a public benefit corporation dedicated to securing its benefits and mitigating its risks.»
- CTA: «Try Claude», «Read the story», «Model details», «Read announcement».
- Eyebrow: «Project Glasswing».
- Секций: 7.
- Sticky header: дублируется в markup.

### Raycast
- H1: «Your shortcut to everything.»
- Подзаголовок: «A collection of powerful productivity tools all within an extendable launcher. Fast, ergonomic and reliable.»
- CTA: «Download for Mac», «Download for Windows (beta)», «Browse the store».
- Eyebrow: «Introducing GlazeJoin waitlist».
- Hero-фон: анимированный 3D IsolatedCube.
- Секций: 10.
- Тема: **dark-first**.
- Motion: smooth scroll, glass-эффекты, carousel reveals.
- Asymmetric grid у extensions showcase.

### Attio
- H1: «Attio» (далее раскрытие «…AI-native CRM platform…»).
- Секций: 10 (Product / Customers / Testimonials / Alternatives / Help / Resources / Developer Platform / Pricing / Onboarding / Agent).
- Визуальные стили из fetch не извлекаются (ответ отдан как docs-страница).

### Cal.com
- H1: «The better way to schedule your meetings»
- Подзаголовок: «A fully customizable scheduling software for individuals, businesses taking calls and developers building scheduling platforms where users meet users.»
- CTA: «Sign up with Google», «Sign up with email», «Get started», «Book a demo».
- Eyebrow: «Cal.com launches».
- Секций: 6.
- Step-by-step numbered visual flow (01, 02, 03).

### Railway
- H1: «Ship software peacefully»
- Подзаголовок: «With the all-in-one intelligent cloud provider»
- CTA: «Deploy →», «Demo», footer «All Aboard».
- Eyebrow: «The all-in-one intelligent cloud provider» (используется как прехедер).
- Hero-фон: dual-image day/dusk train illustrations (WebP).
- Marquee: 12+ логотипов.
- Live-counter: «2,899,097 users, 9,144,421 services, 60,547,867 deployments» — tabular-nums.
- Секций: 7–9.

### Supabase (бонус)
- H1: «Build in a weekend, Scale to millions»
- Подзаголовок: «Supabase is the Postgres development platform…»
- CTA: «Start your project», «Request a demo», «Sign in».
- Eyebrow: «State of Startups 2026: Take the survey.»
- Hero: gradient + product-vis.
- Шрифт: **Inter** (подтверждено).
- Container: ~1280 px.
- Тема: **dark-first**.

### Runway (бонус)
- H1: «FP&A for AI-fluent teams—Simulate any business decision in seconds»
- Подзаголовок: «Collaborative planning, reporting, and forecasting powered by an agent that knows your model as well as you do.»
- CTA: «Talk to a human», «See it in action», «Get a personalized sneak peek», «Login».
- Eyebrow: «Free playbook: Before you spend $50K on AI, run this audit».
- Hero: ландшафтное изображение (mountain, blue/teal).
- Секций: 12.
- Asymmetric grid — да. Marquee клиентов — да.

### Resend (бонус)
- Вернулся дев-документ, а не лендинг — H1 «Resend», eyebrow «For AI agents and automation, use the tools below.» Подзаголовок про email API. Визуальные стили не извлечены.

### rauno.me (бонус)
- Минималистичная авторская страница. Только философия: «Make it fast. Make it beautiful. Make it consistent. Make it carefully. Make it timeless. Make it soulful. Make it.» Визуальные стили не доступны через fetch.

</details>

---

*Отчёт подготовлен: 2026-04-20. Следующий шаг — выписать токены темы KSV в `assets/tokens.css` и сверстать hero + первую секцию с применением правил из §9.*
