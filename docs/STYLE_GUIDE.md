# Style Guide — Learn Stock Trading

This guide defines how every chapter in this course is written and structured.
Keep it consistent so the content stays beginner-friendly **and** easy for an app
(Android/iOS/web) to parse and render.

## Who we write for

- A **complete beginner** who has never traded before.
- Someone reading on a **phone**, in short sessions.
- English may be their second language — so keep it plain.

## Voice & writing rules

1. **Simple words.** Short sentences. One idea per sentence.
2. **Points, not walls of text.** Prefer bullet lists over long paragraphs.
3. **Define every jargon word** the first time it appears — inline, in brackets.
4. **Use analogies** from everyday life (shops, cricket, traffic, a market bazaar).
5. **Be honest about risk.** Never promise profit. Never say "guaranteed".
6. **No hype.** No "get rich", no "secret trick". Calm, mentor tone.
7. Use **examples with round numbers** so the maths is easy to follow.
8. Currency-neutral: use `₹` for Indian examples where natural, but keep concepts
   universal. Mention India specifics (Demat, NSE/BSE, SEBI) where relevant since
   that is the learner's likely market — but say the ideas apply to any market.

## Chapter file format

Each chapter is **one Markdown file** with **YAML frontmatter** at the very top.
The frontmatter powers the app (navigation, quiz, tags). The body is the lesson.

### Frontmatter (required, in this order)

```yaml
---
id: 11                       # global chapter number (matches manifest.json)
module: price-action         # module id (matches manifest.json)
module_title: "Reading Charts & Price Action"
order: 3                     # order within the module
title: "How Price Moves"
slug: how-price-moves
difficulty: beginner         # beginner | intermediate
estimated_minutes: 8
tags: [waves, impulse, correction, trend]
prerequisites: [9]           # chapter ids to read first ([] if none)
summary: "One-line summary of the chapter."
---
```

### Body sections (use these exact H2 headings, in this order)

```markdown
# <Chapter Title>

> **In one line:** <the whole lesson compressed to a single sentence.>

## 🎯 What you'll learn
- 3–5 bullet points of the learning objectives.

## 📘 Key concepts
Use `###` sub-headings to break the topic into 2–4 chunks.
Each chunk is a short intro line + bullet points.

## 🔍 Example
A short, concrete worked example with round numbers. A tiny ASCII sketch is fine.

## ⚠️ Common mistakes
- 3–5 bullets of what beginners get wrong here.

## ✅ Key takeaways
- 3–5 one-line bullets that summarise the chapter.

## 📝 Quick check
1. **Q:** A question.
   **A:** A one- or two-line answer.
2. **Q:** ...
   **A:** ...
(2–3 questions. Great for app quiz cards.)

## 📖 New words
- **Term** — plain-English definition.
(Only the new jargon introduced in this chapter.)

---
*Educational content only — not financial advice. Trading involves the risk of losing money.*
```

## Length

- Aim for **500–900 words** of body (not counting frontmatter).
- Long enough to teach, short enough to read on a phone in one sitting.

## Diagrams

- Prefer a **small ASCII sketch** or a described "picture in words".
- If you reference a visual (e.g. a candlestick), describe it so the app team can
  later replace it with a real graphic. Keep any ASCII art narrow (fits a phone).

## App-readiness checklist (why the format matters)

- Frontmatter = structured metadata → the app builds menus, progress, search, quiz.
- Fixed H2 sections → the app can render collapsible cards or tabs per section.
- `## 📝 Quick check` → becomes flashcards / quiz screens.
- `## 📖 New words` → feeds a global glossary and tap-to-define popups.
- `tags` and `prerequisites` → power "related lessons" and unlock logic.
