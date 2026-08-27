# Broski — план реализации по секциям

Скармливать Claude Code по одной фазе за раз. Не начинать следующую, пока не проверена предыдущая на реальном слабом устройстве (throttling в devtools + старый телефон/ноут).

---

## ✅ Готово (не трогать)
- Header (прозрачный → solid при скролле)
- Hero (Porsche, GT3 RS, статичное фото + текст)
- Wash-video секция (заменяет Block 02 "Ergebnisse") — готова

---

## Фаза 1 — Kalkulator / Online-Anfrage (Block 03 + 03.1)

Упрощённая версия (по итогам разбора):
- Марка/модель — НЕ автокомплит с внешней базой, просто необязательное текстовое поле
- Прогрессивные шаги: Fahrzeugklasse → Leistung → Zusatzleistungen → цена показывается сразу после каждого шага
- Контакты — только в конце: имя, email, телефон, сообщение (без лишних обязательных полей)
- Фото-аплоад — только в ветке "individuelle Anfrage", не в основном расчёте
- Leder-Farbwiederherstellung визуально выделена среди Zusatzleistungen, не спрятана
- Цена — "ab XXX €", явно как Richtpreis

---

## Фаза 2 — Warum Broski (Block 04)

Простая секция, 4 карточки:
01 Individueller Anspruch · 02 Qualität ohne Kompromisse · 03 Detail für Detail · 04 Mobil bei Ihnen

Без анимационных изысков — короткий текст, минимализм, как остальной сайт.

---

## Фаза 3 — Gewerbekunden (Block 06)

- Заголовок + текст про B2B-условия
- Список услуг (те же, что в Kalkulator)
- Минимальная форма: Firmenname, Ansprechpartner, E-Mail, Telefon, Anzahl/Umfang, Leistungen, Nachricht
- CTA "B2B-ANFRAGE" → ведёт к этой форме, не в основной Kalkulator

---

## Фаза 4 — FAQ (Block 07)

**Не 14 вопросов аккордеоном на главной.** Разделяем:
- На главной: 4 самых конверсионных вопроса (mobiler Service? Preis? Versiegelung-Dauer? Gewerbekunden?) аккордеоном
- Кнопка "Alle Fragen ansehen" → отдельная страница `/faq` со всеми 14
- На `/faq` — добавить FAQPage schema markup (JSON-LD) для Google rich snippets

---

## Фаза 5 — Bewertungen + Finaler CTA (Block 08)

- **Пока без Google API** — комменты пишем вручную, ЛЕЙБЛ секции НЕ "Google-Bewertungen", а нейтральный ("Kundenstimmen" / "Was unsere Kunden sagen") — чтобы не выдавать вручную написанное за реальный гугл-рейтинг
- Когда появятся реальные Google-отзывы — секция целиком заменяется на live Google Places API виджет
- Финальный CTA: "BEREIT FÜR MEHR ALS SAUBER?" + кнопка "AUFBEREITUNG ANFRAGEN" → ведёт в Kalkulator (Фаза 1)

---

## Фаза 6 — Social Media + Footer (Block 09)

- Instagram / TikTok / Facebook / YouTube — иконки, одинаковый визуальный вес, ссылки на профили
- Footer: Broski Detailing, адрес, телефон, email, WhatsApp, Impressum, Datenschutz

---

## Фаза 7 — Fixed CTA (сквозной, делать последним)

- Desktop: ненавязчивая фиксированная кнопка "Termin anfragen"
- Mobile: фиксирована внизу экрана
- Клик → открывает Kalkulator (Фаза 1)
- На финальном CTA-блоке (Фаза 5) — не дублировать визуально поверх него

---

## Общие ограничения на все фазы
- Анимации: только `transform`/`opacity`/`clip-path`. Никаких `filter`/`backdrop-filter`/`box-shadow` в анимации
- `prefers-reduced-motion` — везде
- Ленивая инициализация ниже-фолдовых секций через IntersectionObserver
- Тест на слабом железе перед переходом к следующей фазе
