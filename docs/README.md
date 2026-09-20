# 📈 Learn Stock Trading — From Zero to Confident

A complete, **beginner-first** course that takes you from *"what is a stock?"* all
the way to reading charts, analysing companies, entering and exiting trades, making
profit repeatable, and — most importantly — **handling losses** like a professional.

It is written to be:

- **Simple & point-wise** — plain English, short bullets, everyday analogies.
- **Structured for an app** — every chapter is a Markdown file with machine-readable
  metadata, so this folder can be dropped straight into an Android (or web/iOS) app.
- **Self-contained** — this `docs/` folder can be moved to its own repository as-is.

> ⚠️ **Disclaimer:** This is **educational content only — not financial advice.**
> Trading and investing carry a real risk of losing money. Nothing here is a
> recommendation to buy or sell anything. Always do your own research and never
> risk money you cannot afford to lose.

---

## 🗺️ Course map

The course has **8 modules** and **60 chapters**, in a deliberate learning order.

| # | Module | What you'll be able to do |
|---|--------|---------------------------|
| 1 | **Trading Foundations** | Understand the market and place a first trade safely |
| 2 | **Reading Charts & Price Action** | Read candles, waves and what price is telling you |
| 3 | **Market Structure & Trends** | See trend, support/resistance, zones and patterns |
| 4 | **Technical Indicators** | Confirm price with a few well-chosen tools |
| 5 | **Fundamental & Company Analysis** | Analyse a company and judge its value |
| 6 | **Entries, Exits & Strategies** | Know exactly when to enter and exit |
| 7 | **Risk, Money & Psychology** | Protect capital, take profit, handle loss |
| 8 | **Putting It All Together** | Build a plan, a routine and a review loop |

The full chapter list with metadata lives in **[`manifest.json`](./manifest.json)**.

---

## 📂 Folder structure

```
docs/
├── README.md              ← you are here
├── manifest.json          ← the whole curriculum as data (parse this in the app)
├── STYLE_GUIDE.md         ← how chapters are written & structured
├── reference/
│   └── glossary.md        ← every key term, defined
└── chapters/
    ├── 01-foundations/
    ├── 02-price-action/
    ├── 03-market-structure/
    ├── 04-indicators/
    ├── 05-fundamentals/
    ├── 06-strategies/
    ├── 07-risk-psychology/
    └── 08-mastery/
```

Each chapter file is named `NN-slug.md` (e.g. `11-how-price-moves.md`), where `NN`
is the global chapter number so files sort in reading order.

---

## 📱 Building the Android app from this folder

This content is intentionally shaped as **data + Markdown** so a mobile app can
render it without hardcoding lessons.

1. **Ship `manifest.json`** with the app (or fetch it from a server). It lists every
   module and chapter with `id`, `title`, `file`, `order`, `tags`, `difficulty`,
   `estimated_minutes`, `prerequisites` and a `summary`.
2. **Build the navigation** (course → module → chapter list) straight from the
   manifest — no screen is hardcoded.
3. **Render each chapter** by reading its Markdown file. Parse the **YAML
   frontmatter** for the metadata and render the body with any Markdown widget
   (e.g. `flutter_markdown`, Jetpack Compose Markdown, a `WebView`, or Markwon on
   native Android).
4. **Turn sections into features:**
   - `## 📝 Quick check` → quiz / flashcard screens.
   - `## 📖 New words` → tap-to-define glossary popups (also see
     `reference/glossary.md`).
   - `## 🎯 What you'll learn` → the lesson intro card.
   - `tags` + `prerequisites` → "related lessons" and unlock/progress logic.
5. **Track progress** using the stable chapter `id`s from the manifest.

Because every chapter follows the same fixed section headings
(see [`STYLE_GUIDE.md`](./STYLE_GUIDE.md)), the app can reliably split a chapter into
cards, tabs or a scrollable lesson.

---

## 🧭 How to study (for the learner)

- Go **in order** the first time — each module builds on the last.
- Don't rush. Do the **Quick check** at the end of every chapter.
- Modules 6–7 (strategies, risk & psychology) are where most beginners lose money —
  read them slowly and re-read them.
- **Practise on paper first** (Chapter 57) before risking real money.

Good luck — and remember, the goal isn't to be right every time. The goal is to
**protect your money, stay consistent, and let good habits compound.**
