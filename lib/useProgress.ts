"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "trade-learn:progress:v1";
const CHANGE_EVENT = "trade-learn:progress-changed";

function readIds(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((n): n is number => typeof n === "number") : [];
  } catch {
    return [];
  }
}

function writeIds(ids: number[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Storage can be unavailable (private mode, quota) — progress just won't persist.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

// useSyncExternalStore requires a stable snapshot reference between calls
// unless the underlying data actually changed — cache on the raw string.
let cachedRaw = "";
let cachedIds: number[] = [];

function getSnapshot(): number[] {
  const raw = window.localStorage.getItem(STORAGE_KEY) ?? "";
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedIds = readIds();
  }
  return cachedIds;
}

function getServerSnapshot(): number[] {
  return [];
}

export function useProgress() {
  const ids = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const completedIds = new Set(ids);

  const setComplete = useCallback((id: number, complete: boolean) => {
    const current = new Set(readIds());
    if (complete) current.add(id);
    else current.delete(id);
    writeIds([...current]);
  }, []);

  const toggle = useCallback((id: number) => {
    const current = new Set(readIds());
    if (current.has(id)) current.delete(id);
    else current.add(id);
    writeIds([...current]);
  }, []);

  const isComplete = useCallback((id: number) => completedIds.has(id), [completedIds]);

  return { completedIds, isComplete, setComplete, toggle };
}
