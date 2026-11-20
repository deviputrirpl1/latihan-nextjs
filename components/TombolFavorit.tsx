"use client";

import type { Event } from "@/data/events";
import { toggleFavoritId, useFavoritIds } from "@/lib/favorit-strore";

interface TombolFavoritProps {
  id?: number;
  event?: Event;
}

export default function TombolFavorit({ id, event }: TombolFavoritProps) {
  const favoritIds = useFavoritIds();
  const eventId = id ?? event?.id;

  if (eventId === undefined) {
    return null;
  }

  const aktif = favoritIds.includes(eventId);

  function toggleFavorit() {
    if (eventId === undefined) return;
    toggleFavoritId(eventId);
  }

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