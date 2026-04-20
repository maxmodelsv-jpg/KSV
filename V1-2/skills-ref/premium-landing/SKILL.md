---
name: premium-landing
description: Паттерны премиум-лендингов 2025–2026 уровня Linear / Vercel / Stripe / Raycast / Apple. Применяй при вёрстке hero-блоков, выборе типографики, spacing-системы, motion, микро-деталей. Используй при запросах «дорого-богато», «как у Linear», «премиум-вид», «сделать современно», при ревью «почему смотрится шаблонно/дёшево», при выборе шрифтов, letter-spacing, section padding, цветовых шкал. Основан на прямом исследовании 15 эталонных сайтов (2026).
---

# Premium Landing Skill

Ты применяешь паттерны премиум-сегмента SaaS/продуктовых лендингов. Каждое значение ниже — из реального исследования Linear, Vercel, Stripe, Apple, Arc, Framer, Raycast, Supabase, Railway, Cal.com, Attio, Runway, Anthropic (2025–2026).

Это **не** абстрактные «советы дизайнера». Это конкретные числа, которые ставят в код.

## 1. Hero — правила-100% (все премиум-сайты)

### Заголовок H1
- **4–8 слов**, одно ёмкое утверждение. Никогда не «революционный/лучший/безграничный».
- **Sentence case** с точкой в конце (7 из 10 сайтов). Title Case — устарело.
- **Без восклицательных знаков.**
- **oversized:** desktop 56–80 px (display-сайты до 96 px), mobile 36–44 px.
- **Letter-spacing отрицательный:** `-0.02em` до `-0.035em`. Это критично — дефолтный spacing выдаёт любой шаблон.
- **Weight 500–600** (medium/semibold), реже 700. Черный 900 — признак старых агентств.
- **Fluid clamp** обязательно: `clamp(2.5rem, 1.4rem + 4.5vw, 5rem)`.

### Подзаголовок
- **18–22 px**, weight 400, letter-spacing 0.
- **В 2.5–3 раза меньше H1.**
- Раскрывает H1 в 1–2 предложения.

### CTA
- **Две кнопки:** primary solid + secondary ghost/outline. Не три, не одна.
- Примеры пар: «Get started» / «Book a demo», «Deploy» / «Get a Demo».
- Третья CTA — только в навигации («Open app», «Login»).
- **Text-wrap balance** на заголовках: `text-wrap: balance`.

### Eyebrow-label над H1
- В 69% случаев. Форма — pill-badge, tiny (12–13 px), uppercase, letter-spacing `+0.04…+0.08em`, weight 500.
- Тонкая рамка `1px solid rgba(255,255,255,0.1)` + микро-стрелка `→` справа.
- Hover: подсветка границы + сдвиг стрелки на 2 px.
- Наполнение: анонс релиза, статус, локация.

### Фон hero
- **Не картинка**, а **canvas/SVG анимация** (77% случаев): Vercel, Stripe, Raycast. Не видео.
- **Solid** hero редок — обычно скриншот продукта/градиент.
- **Высота** hero ≤ 100vh, CTA всегда в первом экране (above the fold на 1440×900).

### Первый экран
- **Sentence case везде.**
- **Социальное доказательство сразу после hero** (77%) — marquee логотипов/брендов.

## 2. Типографика — золотой стандарт 2026

### Топ-5 шрифтов премиум-сегмента
1. **Geist / Geist Mono** — Vercel, многие Next.js
2. **Inter / Inter Tight** — Supabase, Linear, Attio, Cal.com. Де-факто стандарт SaaS
3. **SF Pro Display/Text** — Apple, Arc
4. **Söhne** (Klim Type Foundry) — Stripe, Anthropic. Human-заметная
5. **GT America / Neue Haas Grotesk / Aeonik** — Framer, Runway

Для русскоязычных проектов Inter и Geist — лучший выбор: оба работают на кириллице.

### Таблица размеров (рабочий диапазон)

| Уровень | Desktop | Mobile | Letter-spacing | Weight |
|---------|---------|--------|----------------|--------|
| H1 hero | 56–80 px (до 96) | 36–44 px | -0.02em…-0.035em | 500–600 |
| H2 section | 40–56 px | 28–34 px | -0.015em…-0.025em | 500–600 |
| H3 card | 22–28 px | 18–22 px | -0.01em | 500 |
| Body large | 18–20 px | 16–17 px | 0 | 400 |
| Body | 15–16 px | 14–15 px | 0 | 400 |
| Label/eyebrow | 12–13 px | 11–12 px | +0.04…+0.08em uppercase | 500 |
| Micro/meta | 11–12 px | 11 px | +0.02em | 400–500 |

### Правила скейла
- **Fluid clamp** доминирует. Fixed scale = устаревший шаблон.
- **5–7 размеров суммарно** на всей главной. 10+ — анти-паттерн.
- **Tabular nums + slashed zero** на всех счётчиках/ценах: `font-feature-settings: 'tnum', 'zero'`.

### Правильная пунктуация
- Кавычки «» или "" — не ""
- Длинное тире — между числами и в перечислениях
- Неразрывный пробел перед ₽/см/мин/см и после коротких предлогов
- `text-wrap: balance` на заголовках, `text-wrap: pretty` на параграфах

## 3. Spacing — ритм, а не размер

### Section padding (вертикальный)
- **Desktop:** 96–160 px сверху и снизу (8–10 rem, clamp)
- **Mobile:** 64–96 px (4–6 rem)
- **Подсекции внутри блока:** 48–64 px

Формула:
```css
section { padding-block: clamp(4rem, 2rem + 6vw, 10rem); }
```

### Container widths
- **1200 px** — Attio, Cal.com, mid-tier SaaS
- **1280 px** — Supabase, Linear
- **1440 px** — Vercel, Stripe (больше воздуха)
- **Fluid 100%** + `padding-inline: clamp(1rem, 4vw, 4rem)` — Apple, Raycast, Runway

### Gap между элементами
- Feature-cards: 16–24 px (tight) или 32 px (дышащие)
- Logo-grid: 40–64 px (чтобы не сливались)
- Pricing-cards: 16–20 px

### Модульный шаг
- **8 px** — де-факто стандарт (Tailwind). Все отступы делятся на 4 без остатка.
- Отклонения от 8/4 — признак непрофессионализма.

## 4. Цветовые системы

### Dark-first vs Light-first (по 13 сайтам)
- **Light-first:** Stripe, Apple, Cal.com, Framer, Runway, Linear, Vercel (с toggle) — 7/13
- **Dark-first:** Raycast, Supabase, Railway, Arc — 6/13
- **Dev/AI-продукты** почти все ушли в dark-first. **Fintech/Productivity** в light-first.

### Типовая dark-палитра (9 ступеней, как Radix)
```
#0A0A0A  background
#111113  surface
#1A1A1D  card
#27272A  border-subtle
#3F3F46  border
#71717A  muted text
#A1A1AA  secondary text
#E4E4E7  primary text
#FAFAFA  white-ish
```

### Акцент — ВСЕГДА ОДИН
- 100% премиум-сайтов имеют **один брендовый цвет**:
  - Raycast — `#FF6363` red
  - Linear — `#5E6AD2` violet
  - Supabase — `#3ECF8E` green
  - Railway — `#8B5CF6` purple
  - Stripe — `#635BFF` lavender
- Используется **только** в CTA, ссылках, status-dot, key-numbers.
- **Никто не красит акцентом большие плоскости фона.**

## 5. Motion — уровень входа 2026

### Обязательный минимум (100% сайтов)
1. **Smooth scroll** (Lenis или CSS `scroll-behavior: smooth`).
2. **Reveal на intersection:** fade + `translateY 8–16px`, duration **600–900 мс**, `ease-out-cubic`, **stagger 60–120 мс**.
3. **Sticky header** с изменением фона: прозрачный над hero → `backdrop-filter: blur(16–20px)` + `rgba(10,10,10,0.72)` после 40–80 px скролла.
4. **Hover на кнопках:** 150 мс transition, `translateY(-1px)` или `scale(1.02)`.
5. **Focus-ring** видимый — премиум-сайты аккуратны с a11y.

### Желаемый средний (60%+)
6. **Marquee логотипов** бесшовным CSS-`@keyframes translateX`.
7. **Canvas/SVG анимированный hero.**
8. **Hover на карточках:** `translateY(-4px)` + тень, либо border-highlight, либо inner-gradient-reveal.
9. **Tabular-nums в счётчиках** с `font-variant-numeric`.
10. **Page transition** (blur / fade) между маршрутами.

### Премиум-плюс (10–20%)
11. **View Transitions API** (Chromium).
12. **Film grain** через `::before` с noise-PNG/SVG, `opacity: 0.03–0.05`, `mix-blend-mode: overlay`.
13. **Scroll-pinning секций** horizontal-transform (Apple product-walls).
14. **Character-split H1** (GSAP SplitText) — у awwwards-финалистов. **НЕ** у SaaS-топов.

## 6. 23 микро-детали, которые делают «дорого»

1. Pill-eyebrow с `1px solid rgba(255,255,255,0.1)` + микро-стрелка `→`. Hover сдвигает стрелку на 2 px.
2. H1 с `letter-spacing: -0.025em` — монолитность слова.
3. Subtle-gradient под H1 через `background-clip: text` — нейтральный brand→white.
4. **Строго 1 px** border на карточках — не 2 px, не тень. `1px solid color-mix(in oklch, white 8%, transparent)`.
5. **Inner-glow** на dark-карточках: `box-shadow: inset 0 1px 0 rgba(255,255,255,0.06)` — стеклянный край.
6. **Backdrop-blur 16–20 px** на sticky-хедере + `rgba(10,10,10,0.72)`.
7. **Noise-текстура 0.03–0.05 opacity** поверх плоских фонов — убирает «пластик».
8. **Tabular-nums + slashed zero** через `font-feature-settings: 'tnum', 'zero'` — все цифры.
9. **Линейные иконки 16×16 stroke 1.5 px** (Lucide, Phosphor, Radix). Не 2 px, не filled.
10. **Focus-ring** через `outline-offset: 2px` + прозрачный accent-color.
11. **Shimmer @keyframes** на skeleton-состояниях, а не серые блоки.
12. **Hover на иконке** — `scale(1.05)` + subtle-tint фона.
13. **Staggered-reveal списка** — каждый элемент с delay 60 мс.
14. **Правильные кавычки** «» или "" — не "".
15. **Длинное тире** `—`, не дефис `-`.
16. **Scroll-snap** мягкий: `scroll-snap-type: x mandatory` без jerk-а.
17. **`color-scheme: dark light`** в CSS — dark-скроллбары.
18. **Preload локальных .woff2** с `font-display: swap`.
19. **AVIF с WebP-fallback** через `<picture>`.
20. **Секция «числа/факты»** с tabular-nums и маленькими label-ами.
21. **`text-wrap: balance`** на заголовках, `text-wrap: pretty` на параграфах.
22. **Divider с gradient-fadeout** вместо сплошной линии.
23. **Статус-дот с pulse** в футере: «All systems operational».

## 7. 10 анти-паттернов — НЕ делать

1. Splash-loader с прогресс-баром.
2. Видео-hero со звуком/тяжёлое (>2 МБ).
3. Больше 3 CTA на первом экране.
4. Карусели с dots-индикаторами и autoplay. Marquee — можно.
5. Page-wide parallax — стал локальным эффектом, не на всю страницу.
6. Скевоморфизм, эмодзи как основные иконки.
7. Хайлайтер-жёлтый или фиолетовый-градиент 2020-х.
8. **Тяжёлые drop-shadow blur 40+ px opacity 0.2**. Премиум — 1 px borders + inner-glow.
9. `cursor: pointer` на всём подряд.
10. **Title Case + восклицание** в H1. Sentence case, без «!».

## 8. Чек-лист ревью премиум-лендинга

Прогоняй по этому списку при ревью/вёрстке:

**Hero**
- [ ] H1 в 4–8 слов, sentence case, с точкой
- [ ] Letter-spacing H1 от -0.02em до -0.035em
- [ ] Fluid clamp() на H1 и H2
- [ ] Подзаголовок в 2.5–3 раза меньше H1, weight 400
- [ ] 2 CTA: primary solid + secondary ghost
- [ ] Pill-eyebrow над H1 (опционально, но усиливает)
- [ ] Hero ≤ 100vh, CTA above-the-fold на 1440×900
- [ ] Фон не статичная картинка — canvas/SVG/градиент

**Типографика**
- [ ] ≤ 7 размеров на всей странице
- [ ] Шрифт: Inter/Geist/Söhne/SF Pro (не Roboto, не Open Sans, не Montserrat)
- [ ] Tabular-nums на всех цифрах
- [ ] `text-wrap: balance` на заголовках
- [ ] Правильные кавычки, длинные тире, неразрывные пробелы

**Spacing**
- [ ] Section padding clamp(4rem, 2rem + 6vw, 10rem)
- [ ] Container max-width 1200/1280/1440, не «растёт до бесконечности»
- [ ] Все gap и padding делятся на 4
- [ ] Между секциями больше, чем внутри

**Цвет**
- [ ] ОДИН брендовый акцент
- [ ] 9–11-ступенчатая нейтральная шкала
- [ ] Акцент только в CTA / status / ключевых числах
- [ ] Никаких hero-фонов в акцентном цвете

**Motion**
- [ ] Smooth scroll подключён (Lenis или CSS)
- [ ] Reveal на intersection: fade + 8–16 px, 700 мс, stagger 60–120 мс
- [ ] Sticky header с backdrop-blur при скролле
- [ ] Hover-lift на карточках и кнопках
- [ ] prefers-reduced-motion уважается

**Детали**
- [ ] 1 px borders на карточках (не тени)
- [ ] Inner-glow на dark-карточках
- [ ] Noise-overlay 0.03–0.05 на плоских фонах
- [ ] Focus-ring видимый и стилизованный
- [ ] Иконки 16×16 stroke 1.5 px
- [ ] Divider с gradient-fadeout

**Анти-паттерны отсутствуют**
- [ ] Нет splash-loader
- [ ] Нет video-hero со звуком
- [ ] Нет >3 CTA
- [ ] Нет Title Case с «!» в H1
- [ ] Нет drop-shadow 40+ px
- [ ] Нет dots-карусели с autoplay
- [ ] Нет page-wide parallax

## 9. Как отвечать пользователю

1. **Диагностируй** — по какому пункту чек-листа страница провисает. Конкретные номера.
2. **Приоритет** — что бьёт первым (обычно: типографика → spacing → motion → детали).
3. **Конкретные значения** — не «увеличь отступы», а «section padding → clamp(4rem, 2rem + 6vw, 9rem)».
4. **Ссылка на референс** из Top-15. Не «сделай как у Apple», а «возьми H1-подход Raycast: `clamp(2.5rem, 1.4rem + 4.5vw, 5rem)`, letter-spacing `-0.025em`».
5. **Никогда не рекомендуй** Montserrat, Roboto, Open Sans в премиум-контексте.

---

_Основано на исследовании: `research/premium-patterns.md` (~3100 слов, 15 эталонов, 2026-04)._
