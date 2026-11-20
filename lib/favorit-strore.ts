"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "favorit_events";
const EVENT_NAME = "favorit-events-change";

interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

interface WindowLike {
  localStorage?: StorageLike;
  addEventListener(type: string, listener: () => void): void;
  removeEventListener(type: string, listener: () => void): void;
  dispatchEvent(event: Event): boolean;
}

let cacheRaw: string | null = null;
let cacheIds: number[] = [];

function getWin(): WindowLike | undefined {
  return (globalThis as unknown as { window?: WindowLike }).window;
}

function ambilSnapshot(): number[] {
  const win = getWin();
  const storage = win?.localStorage;
  if (!storage) return cacheIds;

  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (raw === cacheRaw) return cacheIds;
    cacheRaw = raw;

    const parsed: unknown = raw ? JSON.parse(raw) : [];
    cacheIds = Array.isArray(parsed)
      ? parsed.filter((item): item is number => typeof item === "number")
      : [];
    return cacheIds;
  } catch {
    return cacheIds;
  }
}

const SERVER_SNAPSHOT: number[] = [];

function subscribe(callback: () => void) {
  const win = getWin();
  if (!win) return () => {};

  win.addEventListener("storage", callback);
  win.addEventListener(EVENT_NAME, callback);
  return () => {
    win.removeEventListener("storage", callback);
    win.removeEventListener(EVENT_NAME, callback);
  };
}

export function useFavoritIds(): number[] {
  return useSyncExternalStore(subscribe, ambilSnapshot, () => SERVER_SNAPSHOT);
}

export function toggleFavoritId(eventId: number) {
  const win = getWin();
  const storage = win?.localStorage;
  if (!win || !storage) return;

  const saatIni = ambilSnapshot();
  const nextList = saatIni.includes(eventId)
    ? saatIni.filter((id) => id !== eventId)
    : [...saatIni, eventId];

  cacheRaw = JSON.stringify(nextList);
  cacheIds = nextList;
  storage.setItem(STORAGE_KEY, cacheRaw);
  win.dispatchEvent(new Event(EVENT_NAME));
}