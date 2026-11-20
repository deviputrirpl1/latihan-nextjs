"use client";

import Image from "next/image";
import Link from "next/link";
import type { Event } from "@/data/events";
import { toggleFavoritId, useFavoritIds } from "@/lib/favorit-strore";

interface KartuEventProps {
  event: Event;
}

export default function KartuEvent({ event }: KartuEventProps) {
  const favoritIds = useFavoritIds();
  const aktif = favoritIds.includes(event.id);

  function toggleFavorit() {
    toggleFavoritId(event.id);
  }

  return (
    <div className="rounded-lg border p-4 shadow-sm">
      {event.gambar ? (
        <Image
          src={event.gambar}
          alt={event.judul}
          width={600}
          height={240}
          unoptimized
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