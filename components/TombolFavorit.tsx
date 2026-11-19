"use client";

import { useEffect, useState } from "react";
import type { Event } from "@/data/events";

interface TombolFavoritProps {
  event?: Event;
}

type StorageLike = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
};

function getStorage(): StorageLike | null {
  const g = globalThis as typeof globalThis & { localStorage?: StorageLike };
  return g.localStorage ?? null;
}

export default function TombolFavorit({ event }: TombolFavoritProps) {
  const [isFavorit, setIsFavorit] = useState(false);
  const [mounted, setMounted] = useState(false);

  const eventId = event?.id;

  useEffect(() => {
    setMounted(true);
    if (eventId === undefined) {
      setIsFavorit(false);
      return;
    }

    const storage = getStorage();
    if (!storage) return;

    try {
      const raw = storage.getItem("favorit_events");
      const parsed: unknown = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) {
        setIsFavorit(parsed.includes(eventId));
      }
    } catch {
      setIsFavorit(false);
    }
  }, [eventId]);

  function toggleFavorit() {
    if (eventId === undefined) return;

    const storage = getStorage();
    if (!storage) {
      setIsFavorit((prev) => !prev);
      return;
    }

    try {
      const raw = storage.getItem("favorit_events");
      const parsed: unknown = raw ? JSON.parse(raw) : [];
      const list: number[] = Array.isArray(parsed)
        ? parsed.filter((item): item is number => typeof item === "number")
        : [];

      const nextList = list.includes(eventId)
        ? list.filter((id) => id !== eventId)
        : [...list, eventId];

      storage.setItem("favorit_events", JSON.stringify(nextList));
      setIsFavorit(nextList.includes(eventId));
    } catch {
      setIsFavorit((prev) => !prev);
    }
  }

  if (!event) {
    return null;
  }

  const aktif = mounted && isFavorit;

  return (
    <button
      type="button"
      onClick={toggleFavorit}
      aria-label="Toggle favorit"
      className={`mt-3 mb-4 inline-flex items-center gap-2 rounded border px-3 py-1.5 text-sm font-medium ${
        aktif
          ? "border-red-500 text-red-600"
          : "border-slate-300 text-slate-600"
      }`}
    >
      <span className={aktif ? "text-red-500" : "text-gray-400"}>♥</span>
      <span>{aktif ? "Tersimpan di Favorit" : "Simpan ke Favorit"}</span>
    </button>
  );
}