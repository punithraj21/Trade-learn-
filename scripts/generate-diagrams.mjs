#!/usr/bin/env node
// Reusable inline-SVG diagram generators for the Learn Stock Trading course.
// Build-time only tool (not imported by the app) — used to hand-author real
// diagrams to replace the placeholder ASCII-art "charts" in chapter Markdown.
//
// Palette (validated with the dataviz skill's scripts/validate_palette.js
// against the light chart surface #fcfcfb):
//   accent lines  #2a78d6 (blue) / #eb6834 (orange) — pass CVD + contrast as a pair
//   up/down       #0ca30c (good) / #d03b3b (critical) — FAIL CVD as a bare hue
//                 pair (classic red/green problem), so every up/down encoding
//                 here also carries a shape cue: candle bodies are hollow
//                 (outline only) when up, solid-filled when down; gain/loss
//                 bars are told apart by which side of a drawn zero-baseline
//                 they sit on, not by color alone.
// These are static illustrative figures (shipped as .svg files referenced via
// plain <img>, not live interactive DOM charts), so there's no hover/tooltip
// layer — that's for the app's own interactive UI, not a textbook diagram.
//
// Usage: node scripts/generate-diagrams.mjs <output.svg> '<json spec>'
//   spec.type selects the generator: priceLine | candlestick | candleAnatomy |
//   indicatorPanel | barCompare | riskReward | donut | flow

import fs from "node:fs";
import path from "node:path";

// ---------------------------------------------------------------------------
// Design tokens (see references/palette.md in the dataviz skill)
// ---------------------------------------------------------------------------
const INK = "#0b0b0b";
const INK_SECONDARY = "#52514e";
const INK_MUTED = "#898781";
const SURFACE = "#fcfcfb";
const BORDER = "rgba(11,11,11,0.10)";
const GRIDLINE = "#e1e0d9";
const BASELINE = "#c3c2b7";
const GOOD = "#0ca30c"; // up / bullish / gain
const CRITICAL = "#d03b3b"; // down / bearish / loss
const ACCENT_1 = "#2a78d6"; // blue — primary overlay line (e.g. an MA, RSI line)
const ACCENT_2 = "#eb6834"; // orange — secondary overlay line (e.g. a 2nd MA)
const FONT = "system-ui, -apple-system, 'Segoe UI', sans-serif";

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Wraps inner markup in the shared card surface + title. */
function card({ width, height, title, inner, subtitle }) {
  const titleY = 28;
  const bodyTop = title ? 44 : 16;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" font-family="${FONT}">
  <rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" rx="12" fill="${SURFACE}" stroke="${BORDER}"/>
  ${title ? `<text x="20" y="${titleY}" font-size="15" font-weight="600" fill="${INK}">${esc(title)}</text>` : ""}
  ${subtitle ? `<text x="20" y="${titleY + 16}" font-size="12" fill="${INK_SECONDARY}">${esc(subtitle)}</text>` : ""}
  <g transform="translate(0, ${bodyTop})">${inner}</g>
</svg>`;
}

// ---------------------------------------------------------------------------
// A. priceLine — the workhorse: a price path with optional support/resistance
//    levels, shaded zones, extra overlay lines (MAs/bands), and point markers
//    (entry/stop/target/breakout/bounce). Covers trend, support/resistance,
//    breakouts, channels, and Bollinger-style bands (as two overlay lines +
//    a zone fill between them).
// ---------------------------------------------------------------------------
function priceLine(spec) {
  const width = spec.width ?? 640;
  const height = spec.height ?? 300;
  const padL = 44,
    padR = 20,
    padT = 8,
    padB = 28;
  const plotW = width - padL - padR;
  const plotH = height - 60 - padT - padB;
  const points = spec.points; // [{label, value}]
  const allValues = [
    ...points.map((p) => p.value),
    ...(spec.overlays ?? []).flatMap((o) => o.points), // overlays[].points is a plain number array
    ...(spec.levels ?? []).map((l) => l.value),
  ];
  const min = spec.yMin ?? Math.min(...allValues);
  const max = spec.yMax ?? Math.max(...allValues);
  const span = max - min || 1;
  const pad = span * 0.12;
  const yMin = min - pad,
    yMax = max + pad;

  const x = (i) => padL + (points.length > 1 ? (i / (points.length - 1)) * plotW : plotW / 2);
  const y = (v) => padT + plotH - ((v - yMin) / (yMax - yMin)) * plotH;

  const pathD = (pts) =>
    pts.map((p, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(p.value).toFixed(1)}`).join(" ");
  const pathDValues = (vals) =>
    vals.map((v, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");

  let svg = "";

  // gridlines (hairline, horizontal only — keeps it quiet)
  const gridCount = 4;
  for (let g = 0; g <= gridCount; g++) {
    const gy = padT + (g / gridCount) * plotH;
    svg += `<line x1="${padL}" y1="${gy.toFixed(1)}" x2="${width - padR}" y2="${gy.toFixed(1)}" stroke="${GRIDLINE}" stroke-width="1"/>`;
  }

  // shaded zones (support/resistance/demand/supply bands)
  for (const z of spec.zones ?? []) {
    const fill = z.kind === "resistance" || z.kind === "supply" ? CRITICAL : ACCENT_1;
    const zy1 = y(z.to);
    const zy2 = y(z.from);
    svg += `<rect x="${padL}" y="${Math.min(zy1, zy2).toFixed(1)}" width="${plotW}" height="${Math.abs(zy2 - zy1).toFixed(1)}" fill="${fill}" fill-opacity="0.10"/>`;
    svg += `<text x="${width - padR - 6}" y="${(Math.min(zy1, zy2) + 12).toFixed(1)}" font-size="10" text-anchor="end" fill="${INK_MUTED}">${esc(z.label ?? z.kind)}</text>`;
  }

  // dashed horizontal levels (support/resistance lines)
  for (const l of spec.levels ?? []) {
    const ly = y(l.value);
    const stroke = l.kind === "resistance" ? CRITICAL : l.kind === "support" ? ACCENT_1 : INK_MUTED;
    svg += `<line x1="${padL}" y1="${ly.toFixed(1)}" x2="${width - padR}" y2="${ly.toFixed(1)}" stroke="${stroke}" stroke-width="1.5" stroke-dasharray="5 4"/>`;
    svg += `<text x="${(padL + 6).toFixed(1)}" y="${(ly - 4).toFixed(1)}" font-size="10" text-anchor="start" fill="${INK_MUTED}">${esc(l.label ?? l.value)}</text>`;
  }

  // baseline axis
  svg += `<line x1="${padL}" y1="${(padT + plotH).toFixed(1)}" x2="${width - padR}" y2="${(padT + plotH).toFixed(1)}" stroke="${BASELINE}" stroke-width="1"/>`;

  // x labels (first, last, and any marker positions — sparing, not every tick)
  const labelIdxs = new Set([0, points.length - 1, ...(spec.markers ?? []).map((m) => m.index)]);
  for (const i of labelIdxs) {
    if (points[i] == null) continue;
    svg += `<text x="${x(i).toFixed(1)}" y="${height - 60 - 8}" font-size="10" text-anchor="middle" fill="${INK_MUTED}">${esc(points[i].label)}</text>`;
  }

  // overlay lines (e.g. moving averages) drawn under the main price line
  const overlayColors = [ACCENT_1, ACCENT_2];
  (spec.overlays ?? []).forEach((o, idx) => {
    const color = overlayColors[idx % overlayColors.length];
    const dash = idx === 1 ? ' stroke-dasharray="6 4"' : "";
    svg += `<path d="${pathDValues(o.points)}" fill="none" stroke="${color}" stroke-width="2"${dash} stroke-linecap="round" stroke-linejoin="round"/>`;
    const last = o.points[o.points.length - 1];
    svg += `<text x="${(x(o.points.length - 1) + 6).toFixed(1)}" y="${y(last).toFixed(1)}" font-size="10" fill="${color === ACCENT_1 ? "#184f95" : "#a8471f"}">${esc(o.label ?? "")}</text>`;
  });

  // main price line
  svg += `<path d="${pathD(points)}" fill="none" stroke="${INK}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;

  // markers (entry/stop/target/bounce/breakout — labelled sparingly)
  const markerColor = { entry: ACCENT_1, target: GOOD, stop: CRITICAL, point: INK };
  for (const m of spec.markers ?? []) {
    const p = points[m.index];
    if (!p) continue;
    const mx = x(m.index),
      my = y(p.value);
    const col = markerColor[m.type] ?? INK;
    svg += `<circle cx="${mx.toFixed(1)}" cy="${my.toFixed(1)}" r="5" fill="${col}" stroke="${SURFACE}" stroke-width="2"/>`;
    const above = m.labelPos !== "below";
    svg += `<text x="${mx.toFixed(1)}" y="${(my + (above ? -10 : 18)).toFixed(1)}" font-size="10.5" font-weight="600" text-anchor="middle" fill="${INK}">${esc(m.label)}</text>`;
  }

  return card({ width, height, title: spec.title, subtitle: spec.subtitle, inner: svg });
}

// ---------------------------------------------------------------------------
// B. candlestick — OHLC bars. Up = hollow (outline only), down = solid fill —
//    the shape cue that keeps direction legible without relying on hue alone.
// ---------------------------------------------------------------------------
function candlestick(spec) {
  const width = spec.width ?? 640;
  const height = spec.height ?? 300;
  const padL = 44,
    padR = 20,
    padT = 8,
    padB = 28;
  const plotW = width - padL - padR;
  const plotH = height - 60 - padT - padB;
  const candles = spec.candles;
  const all = candles.flatMap((c) => [c.high, c.low]);
  const min = Math.min(...all),
    max = Math.max(...all);
  const span = max - min || 1;
  const pad = span * 0.12;
  const yMin = min - pad,
    yMax = max + pad;
  const y = (v) => padT + plotH - ((v - yMin) / (yMax - yMin)) * plotH;
  const slot = plotW / candles.length;
  const bodyW = Math.min(24, slot * 0.55);

  let svg = "";
  const gridCount = 4;
  for (let g = 0; g <= gridCount; g++) {
    const gy = padT + (g / gridCount) * plotH;
    svg += `<line x1="${padL}" y1="${gy.toFixed(1)}" x2="${width - padR}" y2="${gy.toFixed(1)}" stroke="${GRIDLINE}" stroke-width="1"/>`;
  }
  svg += `<line x1="${padL}" y1="${(padT + plotH).toFixed(1)}" x2="${width - padR}" y2="${(padT + plotH).toFixed(1)}" stroke="${BASELINE}" stroke-width="1"/>`;

  candles.forEach((c, i) => {
    const cx = padL + slot * (i + 0.5);
    const up = c.close >= c.open;
    const color = up ? GOOD : CRITICAL;
    const bodyTop = y(Math.max(c.open, c.close));
    const bodyBottom = y(Math.min(c.open, c.close));
    svg += `<line x1="${cx.toFixed(1)}" y1="${y(c.high).toFixed(1)}" x2="${cx.toFixed(1)}" y2="${y(c.low).toFixed(1)}" stroke="${color}" stroke-width="1.5"/>`;
    const bh = Math.max(2, bodyBottom - bodyTop);
    svg += `<rect x="${(cx - bodyW / 2).toFixed(1)}" y="${bodyTop.toFixed(1)}" width="${bodyW.toFixed(1)}" height="${bh.toFixed(1)}" fill="${up ? SURFACE : color}" stroke="${color}" stroke-width="1.5" rx="1.5"/>`;
    if (c.label) {
      svg += `<text x="${cx.toFixed(1)}" y="${height - 60 - 8}" font-size="10" text-anchor="middle" fill="${INK_MUTED}">${esc(c.label)}</text>`;
    }
  });

  (spec.overlays ?? []).forEach((o, idx) => {
    const color = idx === 0 ? ACCENT_1 : ACCENT_2;
    const d = o.points
      .map((v, i) => `${i === 0 ? "M" : "L"} ${(padL + slot * (i + 0.5)).toFixed(1)} ${y(v).toFixed(1)}`)
      .join(" ");
    svg += `<path d="${d}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
  });

  return card({ width, height, title: spec.title, subtitle: spec.subtitle, inner: svg });
}

// ---------------------------------------------------------------------------
// C. candleAnatomy — one large labelled candle (open/close/high/low/body/wick)
// ---------------------------------------------------------------------------
function candleAnatomy(spec) {
  const width = spec.width ?? 420;
  const height = spec.height ?? 320;
  const { open, high, low, close } = spec;
  const up = close >= open;
  const color = up ? GOOD : CRITICAL;
  const padT = 20,
    padB = 44;
  const plotH = height - 60 - padT - padB;
  const min = low - (high - low) * 0.25;
  const max = high + (high - low) * 0.25;
  const y = (v) => padT + plotH - ((v - min) / (max - min)) * plotH;
  const cx = width / 2 - 60;
  const bodyW = 56;
  const bodyTop = y(Math.max(open, close));
  const bodyBottom = y(Math.min(open, close));

  const leader = (val, label, side) => {
    const ly = y(val);
    const x2 = side === "left" ? cx - bodyW / 2 - 10 : cx + bodyW / 2 + 10;
    const xText = side === "left" ? x2 - 8 : x2 + 8;
    return `<line x1="${(side === "left" ? cx - bodyW / 2 : cx + bodyW / 2).toFixed(1)}" y1="${ly.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${ly.toFixed(1)}" stroke="${INK_MUTED}" stroke-width="1"/>
      <text x="${xText.toFixed(1)}" y="${(ly + 4).toFixed(1)}" font-size="11" text-anchor="${side === "left" ? "end" : "start"}" fill="${INK_SECONDARY}">${esc(label)}</text>`;
  };

  let svg = "";
  svg += `<line x1="${cx.toFixed(1)}" y1="${y(high).toFixed(1)}" x2="${cx.toFixed(1)}" y2="${y(low).toFixed(1)}" stroke="${color}" stroke-width="2"/>`;
  svg += `<rect x="${(cx - bodyW / 2).toFixed(1)}" y="${bodyTop.toFixed(1)}" width="${bodyW}" height="${Math.max(4, bodyBottom - bodyTop).toFixed(1)}" fill="${up ? SURFACE : color}" stroke="${color}" stroke-width="2" rx="2"/>`;
  svg += leader(high, `High — ${high}`, "right");
  svg += leader(low, `Low — ${low}`, "right");
  svg += leader(Math.max(open, close), up ? `Close — ${close}` : `Open — ${open}`, "left");
  svg += leader(Math.min(open, close), up ? `Open — ${open}` : `Close — ${close}`, "left");

  // Bottom legend row (never edge-clipped, unlike inline side captions would be
  // for longer text) explaining the body/wick anatomy and the shape cue.
  const legendY = padT + plotH + 26;
  const legendItems = [
    { swatch: "body", text: up ? "Body (hollow = up)" : "Body (filled = down)" },
    { swatch: "wick", text: "Wick = high/low reach" },
  ];
  let lx = width / 2 - 110;
  for (const item of legendItems) {
    if (item.swatch === "body") {
      svg += `<rect x="${lx}" y="${legendY - 9}" width="14" height="11" rx="1.5" fill="${up ? SURFACE : color}" stroke="${color}" stroke-width="1.5"/>`;
    } else {
      svg += `<line x1="${lx + 7}" y1="${legendY - 9}" x2="${lx + 7}" y2="${legendY + 2}" stroke="${color}" stroke-width="1.5"/>`;
    }
    svg += `<text x="${lx + 20}" y="${legendY}" font-size="10.5" fill="${INK_MUTED}">${esc(item.text)}</text>`;
    lx += 20 + item.text.length * 5.6 + 18;
  }

  return card({ width, height, title: spec.title, subtitle: spec.subtitle, inner: svg });
}

// ---------------------------------------------------------------------------
// D. indicatorPanel — oscillator sub-chart (RSI-style thresholds or
//    MACD-style zero-line + histogram)
// ---------------------------------------------------------------------------
function indicatorPanel(spec) {
  const width = spec.width ?? 640;
  const height = spec.height ?? 220;
  const padL = 44,
    padR = 20,
    padT = 8,
    padB = 28;
  const plotW = width - padL - padR;
  const plotH = height - 60 - padT - padB;
  const values = spec.points.map((p) => p.value);
  const min = spec.yMin ?? Math.min(...values, ...(spec.thresholds ?? []).map((t) => t.value));
  const max = spec.yMax ?? Math.max(...values, ...(spec.thresholds ?? []).map((t) => t.value));
  const span = max - min || 1;
  const pad = span * 0.1;
  const yMin = min - pad,
    yMax = max + pad;
  const y = (v) => padT + plotH - ((v - yMin) / (yMax - yMin)) * plotH;
  const x = (i) => padL + (values.length > 1 ? (i / (values.length - 1)) * plotW : plotW / 2);

  let svg = "";
  for (const t of spec.thresholds ?? []) {
    const ty = y(t.value);
    svg += `<line x1="${padL}" y1="${ty.toFixed(1)}" x2="${width - padR}" y2="${ty.toFixed(1)}" stroke="${t.kind === "overbought" ? CRITICAL : t.kind === "oversold" ? ACCENT_1 : INK_MUTED}" stroke-width="1.5" stroke-dasharray="5 4"/>`;
    svg += `<text x="${(width - 8).toFixed(1)}" y="${(ty - 4).toFixed(1)}" font-size="10" text-anchor="end" fill="${INK_MUTED}">${esc(t.label ?? t.value)}</text>`;
  }
  if (spec.zeroLine) {
    const zy = y(0);
    svg += `<line x1="${padL}" y1="${zy.toFixed(1)}" x2="${width - padR}" y2="${zy.toFixed(1)}" stroke="${BASELINE}" stroke-width="1"/>`;
  }

  if (spec.fillType === "histogram") {
    const barW = Math.min(14, (plotW / values.length) * 0.6);
    values.forEach((v, i) => {
      const zy = y(0);
      const vy = y(v);
      const color = v >= 0 ? GOOD : CRITICAL;
      svg += `<rect x="${(x(i) - barW / 2).toFixed(1)}" y="${Math.min(zy, vy).toFixed(1)}" width="${barW.toFixed(1)}" height="${Math.abs(zy - vy).toFixed(1)}" fill="${color}" rx="1.5"/>`;
    });
  } else {
    const d = values.map((v, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
    svg += `<path d="${d}" fill="none" stroke="${ACCENT_1}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
  }

  const labelIdxs = new Set([0, values.length - 1]);
  for (const i of labelIdxs) {
    svg += `<text x="${x(i).toFixed(1)}" y="${height - 60 - 8}" font-size="10" text-anchor="middle" fill="${INK_MUTED}">${esc(spec.points[i].label)}</text>`;
  }

  return card({ width, height, title: spec.title, subtitle: spec.subtitle, inner: svg });
}

// ---------------------------------------------------------------------------
// E. barCompare — vertical bars from a zero baseline. Gain/loss direction is
//    told apart by which side of the baseline the bar falls on (position),
//    not color alone, then reinforced with good/critical fill.
// ---------------------------------------------------------------------------
function barCompare(spec) {
  const width = spec.width ?? 480;
  const height = spec.height ?? 280;
  const padL = 20,
    padR = 20,
    padT = 20,
    padB = 40;
  const plotW = width - padL - padR;
  const plotH = height - 60 - padT - padB;
  const bars = spec.bars; // [{label, value, direction?: 'up'|'down'|'neutral'}]
  const values = bars.map((b) => b.value);
  const min = Math.min(0, ...values),
    max = Math.max(0, ...values);
  const span = max - min || 1;
  const y = (v) => padT + plotH - ((v - min) / span) * plotH;
  const zeroY = y(0);
  const n = bars.length;
  const slot = plotW / n;
  const barW = Math.min(24, slot * 0.55);
  const axisLabelY = padT + plotH + 24; // fixed row for the category (x-axis) labels
  const maxValueLabelY = axisLabelY - 12; // keep value labels clear of that row

  let svg = "";
  svg += `<line x1="${padL}" y1="${zeroY.toFixed(1)}" x2="${width - padR}" y2="${zeroY.toFixed(1)}" stroke="${BASELINE}" stroke-width="1.5"/>`;

  bars.forEach((b, i) => {
    const cx = padL + slot * (i + 0.5);
    const by = y(b.value);
    const color = b.direction === "down" || b.value < 0 ? CRITICAL : b.direction === "neutral" ? ACCENT_1 : GOOD;
    const top = Math.min(by, zeroY);
    const h = Math.max(2, Math.abs(by - zeroY));
    svg += `<rect x="${(cx - barW / 2).toFixed(1)}" y="${top.toFixed(1)}" width="${barW.toFixed(1)}" height="${h.toFixed(1)}" fill="${color}" rx="4"/>`;
    let labelY = by < zeroY ? by - 8 : by + 16;
    labelY = Math.min(labelY, maxValueLabelY);
    svg += `<text x="${cx.toFixed(1)}" y="${labelY.toFixed(1)}" font-size="11" font-weight="600" text-anchor="middle" fill="${INK}">${esc(b.valueLabel ?? b.value)}</text>`;
    svg += `<text x="${cx.toFixed(1)}" y="${axisLabelY.toFixed(1)}" font-size="10.5" text-anchor="middle" fill="${INK_SECONDARY}">${esc(b.label)}</text>`;
  });

  return card({ width, height, title: spec.title, subtitle: spec.subtitle, inner: svg });
}

// ---------------------------------------------------------------------------
// F. riskReward — entry / stop / target bracket on a vertical price axis
// ---------------------------------------------------------------------------
function riskReward(spec) {
  const width = spec.width ?? 420;
  const height = spec.height ?? 320;
  const { entry, stop, target, unit = "" } = spec;
  const padT = 20,
    padB = 30;
  const plotH = height - 60 - padT - padB;
  const min = Math.min(stop, target) - Math.abs(target - stop) * 0.2;
  const max = Math.max(stop, target) + Math.abs(target - stop) * 0.2;
  const y = (v) => padT + plotH - ((v - min) / (max - min)) * plotH;
  const axisX = 70;
  const barX = axisX + 40;

  const risk = Math.abs(entry - stop);
  const reward = Math.abs(target - entry);
  const ratio = (reward / risk).toFixed(1);

  const level = (val, label, color) =>
    `<line x1="${axisX}" y1="${y(val).toFixed(1)}" x2="${width - 20}" y2="${y(val).toFixed(1)}" stroke="${color}" stroke-width="1.5" stroke-dasharray="${color === INK ? "0" : "5 4"}"/>
     <circle cx="${barX}" cy="${y(val).toFixed(1)}" r="5" fill="${color}" stroke="${SURFACE}" stroke-width="2"/>
     <text x="${(axisX - 10).toFixed(1)}" y="${(y(val) + 4).toFixed(1)}" font-size="11" font-weight="600" text-anchor="end" fill="${INK}">${esc(label)}</text>
     <text x="${(width - 22).toFixed(1)}" y="${(y(val) + 4).toFixed(1)}" font-size="10.5" text-anchor="end" fill="${INK_SECONDARY}">${unit}${val}</text>`;

  let svg = "";
  // reward bracket (entry -> target)
  const rTop = Math.min(y(entry), y(target));
  const rH = Math.abs(y(entry) - y(target));
  svg += `<rect x="${(barX - 3).toFixed(1)}" y="${rTop.toFixed(1)}" width="6" height="${rH.toFixed(1)}" fill="${GOOD}" fill-opacity="0.18" rx="3"/>`;
  // risk bracket (entry -> stop)
  const kTop = Math.min(y(entry), y(stop));
  const kH = Math.abs(y(entry) - y(stop));
  svg += `<rect x="${(barX - 3).toFixed(1)}" y="${kTop.toFixed(1)}" width="6" height="${kH.toFixed(1)}" fill="${CRITICAL}" fill-opacity="0.18" rx="3"/>`;

  svg += level(target, "Target", GOOD);
  svg += level(entry, "Entry", INK);
  svg += level(stop, "Stop-loss", CRITICAL);

  svg += `<text x="${(width / 2).toFixed(1)}" y="${height - 60 - 6}" font-size="12" font-weight="600" text-anchor="middle" fill="${INK}">Risk:Reward = 1:${ratio}</text>`;

  return card({ width, height, title: spec.title, subtitle: spec.subtitle, inner: svg });
}

// ---------------------------------------------------------------------------
// G. donut — allocation / position-sizing share
// ---------------------------------------------------------------------------
function donut(spec) {
  const width = spec.width ?? 360;
  const height = spec.height ?? 280;
  const cx = width / 2,
    cy = 60 + (height - 60) / 2 - 6;
  const r = 70,
    stroke = 26;
  const segments = spec.segments; // [{label, value, colorRole}]
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  const roleColor = { accent: ACCENT_1, good: GOOD, critical: CRITICAL, muted: "#c3c2b7" };

  let angle = -90;
  const circumference = 2 * Math.PI * r;
  let svg = "";
  segments.forEach((seg, i) => {
    const frac = seg.value / total;
    const dash = frac * circumference;
    const color = roleColor[seg.colorRole ?? (i === 0 ? "accent" : "muted")] ?? ACCENT_1;
    svg += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="${stroke}" stroke-dasharray="${dash.toFixed(1)} ${(circumference - dash).toFixed(1)}" stroke-dashoffset="${(-((angle + 90) / 360) * circumference).toFixed(1)}" transform="rotate(-90 ${cx} ${cy})"/>`;
    angle += frac * 360;
  });
  svg += `<circle cx="${cx}" cy="${cy}" r="${r - stroke / 2 - 2}" fill="${SURFACE}"/>`;
  svg += `<text x="${cx}" y="${cy + 5}" font-size="16" font-weight="700" text-anchor="middle" fill="${INK}">${esc(spec.centerLabel ?? "")}</text>`;

  const legendY = cy + r + 30;
  segments.forEach((seg, i) => {
    const color = roleColor[seg.colorRole ?? (i === 0 ? "accent" : "muted")] ?? ACCENT_1;
    const ly = legendY + i * 18;
    svg += `<rect x="${cx - 90}" y="${ly - 9}" width="10" height="10" rx="2" fill="${color}"/>`;
    svg += `<text x="${cx - 74}" y="${ly}" font-size="11" fill="${INK_SECONDARY}">${esc(seg.label)} — ${((seg.value / total) * 100).toFixed(0)}%</text>`;
  });

  return card({ width, height, title: spec.title, subtitle: spec.subtitle, inner: svg });
}

// ---------------------------------------------------------------------------
// H. flow — sequential labelled steps connected by arrows (conceptual topics)
// ---------------------------------------------------------------------------
function flow(spec) {
  const nodes = spec.nodes; // [{label}]
  const width = spec.width ?? 640;
  const nodeW = Math.min(140, (width - 40) / nodes.length - 24);
  const nodeH = 56;
  const gap = (width - 40 - nodes.length * nodeW) / Math.max(1, nodes.length - 1);
  const height = spec.height ?? 60 + nodeH + 40;
  const cy = 60 + nodeH / 2 + 10;

  let svg = "";
  nodes.forEach((n, i) => {
    const nx = 20 + i * (nodeW + gap);
    svg += `<rect x="${nx}" y="${(cy - nodeH / 2).toFixed(1)}" width="${nodeW}" height="${nodeH}" rx="10" fill="${SURFACE}" stroke="${ACCENT_1}" stroke-width="2"/>`;
    const words = String(n.label).split(" ");
    const lines = [];
    let cur = "";
    for (const w of words) {
      if ((cur + " " + w).trim().length > 16) {
        lines.push(cur.trim());
        cur = w;
      } else cur = (cur + " " + w).trim();
    }
    if (cur) lines.push(cur);
    lines.slice(0, 3).forEach((line, li) => {
      svg += `<text x="${nx + nodeW / 2}" y="${(cy - ((lines.length - 1) * 12) / 2 + li * 13 + 4).toFixed(1)}" font-size="11.5" font-weight="600" text-anchor="middle" fill="${INK}">${esc(line)}</text>`;
    });
    if (i < nodes.length - 1) {
      const ax1 = nx + nodeW + 4;
      const ax2 = ax1 + gap - 8;
      svg += `<line x1="${ax1}" y1="${cy}" x2="${ax2}" y2="${cy}" stroke="${INK_MUTED}" stroke-width="1.5"/>`;
      svg += `<path d="M ${ax2 - 6} ${cy - 5} L ${ax2 + 2} ${cy} L ${ax2 - 6} ${cy + 5} Z" fill="${INK_MUTED}"/>`;
    }
  });

  return card({ width, height, title: spec.title, subtitle: spec.subtitle, inner: svg });
}

// ---------------------------------------------------------------------------
const GENERATORS = {
  priceLine,
  candlestick,
  candleAnatomy,
  indicatorPanel,
  barCompare,
  riskReward,
  donut,
  flow,
};

function main() {
  const [, , outPath, ...rest] = process.argv;
  if (!outPath || rest.length === 0) {
    console.error(
      "Usage:\n" +
        "  node scripts/generate-diagrams.mjs <output.svg> '<json spec>'\n" +
        "  node scripts/generate-diagrams.mjs <output.svg> --spec-file <spec.json>\n" +
        "(--spec-file avoids shell-quoting headaches — titles/labels with apostrophes\n" +
        " are a common way to break inline JSON on the command line. Write the spec\n" +
        " with the Write tool, then pass its path.)\n" +
        `Available spec.type values: ${Object.keys(GENERATORS).join(", ")}`
    );
    process.exit(1);
  }
  let specText;
  if (rest[0] === "--spec-file") {
    const specFilePath = rest[1];
    if (!specFilePath) {
      console.error("--spec-file requires a path argument");
      process.exit(1);
    }
    try {
      specText = fs.readFileSync(specFilePath, "utf8");
    } catch (e) {
      console.error(`Could not read spec file "${specFilePath}":`, e.message);
      process.exit(1);
    }
  } else {
    specText = rest[0];
  }
  let spec;
  try {
    spec = JSON.parse(specText);
  } catch (e) {
    console.error("Invalid JSON spec:", e.message);
    process.exit(1);
  }
  const gen = GENERATORS[spec.type];
  if (!gen) {
    console.error(`Unknown spec.type "${spec.type}". Available: ${Object.keys(GENERATORS).join(", ")}`);
    process.exit(1);
  }
  let svg;
  try {
    svg = gen(spec);
  } catch (e) {
    console.error(`Failed to render "${spec.type}":`, e.message);
    process.exit(1);
  }
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, svg);
  console.log(`OK ${outPath} (${spec.type}, ${svg.length} bytes)`);
}

main();
