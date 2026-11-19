"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Event } from "@/data/events";

interface KartuEventProps {
  event: Event;
}

type StorageLike = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
};

function getStorage(): StorageLike | null {
  const g = globalThis as typeof globalThis & { localStorage?: StorageLike };
  return g.localStorage ?? null;
}

export default function KartuEvent({ event }: KartuEventProps) {
  const [isFavorit, setIsFavorit] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storage = getStorage();
    if (!storage) return;

    try {
      const raw = storage.getItem("favorit_events");
      const parsed: unknown = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) {
        setIsFavorit(parsed.includes(event.id));
      }
    } catch {
      setIsFavorit(false);
    }
  }, [event.id]);

  function toggleFavorit() {
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

      const nextList = list.includes(event.id)
        ? list.filter((id) => id !== event.id)
        : [...list, event.id];

      storage.setItem("favorit_events", JSON.stringify(nextList));
      setIsFavorit(nextList.includes(event.id));
    } catch {
      setIsFavorit((prev) => !prev);
    }
  }

  const aktif = mounted && isFavorit;

  return (
    <div className="rounded-lg border p-4 shadow-sm">
      {event.gambar ? (
        <img
          src={event.gambar}
          alt={event.judul}
          className="mb-3 h-40 w-full rounded object-cover"
        />
      ) : null}

      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-sm font-medium">{event.kategori}</span>
        <button
          type="button"
          onClick={toggleFavorit}
          className={`text-xl ${aktif ? "text-red-500" : "text-gray-300"}`}
          aria-label="Toggle favorit"
        >
          ♥
        </button>
      </div>

      <h2 className="text-lg font-bold">{event.judul}</h2>
      <p className="text-sm text-gray-600">{event.tanggal}</p>
      <p className="mt-1 text-sm">{event.lokasi}</p>

      <div className="mt-4">
        <Link
          href={`/event/${event.id}`}
          className="inline-block rounded bg-red-600 px-3 py-1.5 text-sm text-white"
        >
          Lihat Detail
        </Link>
      </div>
    </div>
  );
}