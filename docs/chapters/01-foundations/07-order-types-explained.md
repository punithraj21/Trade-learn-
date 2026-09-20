---
id: 7
module: foundations
module_title: "Trading Foundations"
order: 7
title: "Order Types Explained"
slug: order-types-explained
difficulty: beginner
estimated_minutes: 10
tags: [orders, market, limit, stop-loss]
prerequisites: [6]
summary: "Market, limit, stop-loss and other orders — the exact buttons you'll press."
---

# Order Types Explained

> **In one line:** An order is your instruction to the market, and picking the right type decides *how* and *when* your trade happens.

## 🎯 What you'll learn
- What an "order" really is (your instruction to buy or sell).
- The two basic orders: **market** and **limit**.
- How a **stop-loss** protects you from big losses.
- What target, GTT, bracket, and cover orders do.
- Why you should decide your stop-loss *before* you buy.

## 📘 Key concepts

### The two basic orders
Think of the stock market like a busy vegetable bazaar. You can grab a price fast, or you can wait for your price.

- **Market order** — buy or sell *right now* at the best price available.
  - Fast. It fills almost instantly.
  - The exact price is *not* guaranteed. It can slip a little.
  - Good for **liquid stocks** (stocks with many buyers and sellers, so prices are steady).
- **Limit order** — you set your price limit.
  - When buying: the *most* you will pay.
  - When selling: the *least* you will accept.
  - The price is guaranteed, but the fill is *not*. If the market never reaches your price, nothing happens.

Simple rule: market = speed, limit = price control.

### Stop-loss: your safety belt
A **stop-loss (SL)** is an order that stays quiet until the price hits a level you chose. Then it wakes up and exits your trade. It caps how much you can lose.

- **SL-Market** — once the trigger price is hit, it sells at the market price (fast exit, price may slip).
- **SL-Limit** — once triggered, it sells with a limit price (price control, but might not fill if price falls too fast).

Think of it like a smoke alarm: it does nothing until there is danger, then it acts for you.

### Target, GTT, and combo orders
These help you exit with a plan instead of watching the screen all day.

- **Target order** — an order to sell when the price reaches your *profit* goal.
- **GTT (Good Till Triggered)** — an order that waits patiently for days (not just today) until your price is hit.
- **Bracket order** — one order that sets your entry + stop-loss + target *together*.
- **Cover order** — an entry order that *forces* you to attach a stop-loss.

![Flow diagram of a market order: you place the order, it is sent instantly, it fills right away, but the price may slip a little.](/diagrams/order-types-explained-1.svg)

![Flow diagram of a limit order: you set your price, the order waits in the market, and it either fills at your price or does not fill at all.](/diagrams/order-types-explained-2.svg)

![Flow diagram of an SL-Market stop-loss: once the trigger price is hit it sells at the market price for a fast exit, but the price may slip.](/diagrams/order-types-explained-3.svg)

![Flow diagram of an SL-Limit stop-loss: once the trigger price is hit it sells at your limit price for price control, but it may not fill in a fast fall.](/diagrams/order-types-explained-4.svg)

![Flow diagram of a bracket order: you set the entry price, attach a stop-loss, attach a target, and it all becomes one combined order.](/diagrams/order-types-explained-5.svg)

## 🔍 Example
You want to buy 10 shares of a company trading near ₹100.

- You place a **buy limit order at ₹100.** It fills at ₹100.
- You do not want to lose too much, so you place a **stop-loss at ₹95.**
- Your maximum loss = ₹100 − ₹95 = **₹5 per share.**
- For 10 shares, the most you can lose is about **₹50.**
- You also place a **target at ₹110**, so if price rises you book ₹10 per share profit.

![Risk/reward diagram of the trade: buy limit entry at ₹100, stop-loss at ₹95 below it, and target at ₹110 above it, giving a 1:2 risk-to-reward ratio.](/diagrams/order-types-explained-6.svg)

You now have a clear plan before the trade even starts.

## ⚠️ Common mistakes
- Using a **market order on a thin, low-volume stock** — the price can slip badly.
- Placing a limit order and then getting upset it "did not buy" — that is normal; the price never reached your limit.
- Setting a stop-loss *too tight* (like ₹99.5) so normal wiggles kick you out.
- Buying first and *thinking about* a stop-loss later — by then the loss is already large.
- Confusing SL-Market and SL-Limit, then wondering why the SL-Limit did not fill in a fast fall.

![Price line diagram showing a stop-loss set too tight at ₹99.5: normal price wiggles dip just below it, stopping the trade out, right before the price recovers and moves higher.](/diagrams/order-types-explained-7.svg)

## ✅ Key takeaways
- **Market order** = instant fill, price not guaranteed.
- **Limit order** = your price guaranteed, fill not guaranteed.
- **Stop-loss** exits you and caps your loss (SL-Market = fast, SL-Limit = price-controlled).
- **GTT** waits for days; **bracket/cover** orders bundle entry, stop, and target.
- Always set your stop-loss **before** you enter a trade.

## 📝 Quick check
1. **Q:** You must buy a very liquid stock *right now*. Which order fits best?
   **A:** A market order — it fills fast, and slippage is small on liquid stocks.
2. **Q:** You buy at ₹200 and place a stop-loss at ₹190. What is your maximum loss per share?
   **A:** ₹10 per share (₹200 − ₹190).
3. **Q:** What is the difference between SL-Market and SL-Limit?
   **A:** SL-Market exits at the market price once triggered (fast); SL-Limit exits with a set limit price (may not fill in a fast move).

## 📖 New words
- **Order** — your instruction to the market to buy or sell.
- **Market order** — buy or sell immediately at the best available price.
- **Limit order** — buy or sell only at your chosen price or better.
- **Liquid stock** — a stock with many buyers and sellers, so prices are steady.
- **Slippage** — the small gap between the price you expected and the price you got.
- **Stop-loss (SL)** — an order that triggers at a set level to exit and cap your loss.
- **SL-Market** — a stop-loss that exits at market price once triggered.
- **SL-Limit** — a stop-loss that exits with a limit price once triggered.
- **Target order** — an order to sell at your profit goal.
- **GTT (Good Till Triggered)** — an order that waits for days until your price is hit.
- **Bracket order** — one order combining entry, stop-loss, and target.
- **Cover order** — an entry order that requires an attached stop-loss.

---
*Educational content only — not financial advice. Trading involves the risk of losing money.*
