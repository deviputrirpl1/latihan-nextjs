"use client";

import { useState } from "react";
import Link from "next/link";
import type { Event } from "@/data/events";
import { rupiah } from "@/data/events";

export default function KartuEvent({ event }: { event: Event }) {
  const [isFavorit, setIsFavorit] = useState(() => {
    try {
      const win = (globalThis as unknown) as { localStorage?: { getItem: (key: string) => string | null } };
      if (!win.localStorage) return false;
      const favs = JSON.parse(win.localStorage.getItem("favorit") || "[]");
      return favs.includes(event.id);
    } catch {
      return false;
    }
  });

  const toggleFavorit = () => {
    try {
      const win = (globalThis as unknown) as { localStorage?: { getItem: (key: string) => string | null; setItem: (key: string, value: string) => void } };
      if (!win.localStorage) return;
      const favs = JSON.parse(win.localStorage.getItem("favorit") || "[]");
      let updated;
      if (favs.includes(event.id)) {
        updated = favs.filter((id: string | number) => id !== event.id);
      } else {
        updated = [...favs, event.id];
      }
      win.localStorage.setItem("favorit", JSON.stringify(updated));
      setIsFavorit(!isFavorit);
    } catch (e) {
      console.error(e);
    }
  };

  const sisaTiket = event.kuota - event.terisi;

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {event.kategori}
          </span>
          <button
            onClick={toggleFavorit}
            className={`text-xl ${isFavorit ? "text-red-500" : "text-gray-300"}`}
          >
            ♥
          </button>
        </div>
        <h2 className="text-lg font-bold mb-1">
          <Link href={`/event/${event.id}`} className="hover:underline text-blue-600">
            {event.judul}
          </Link>
        </h2>
        <p className="text-sm text-gray-600 mb-2">{event.tanggal}</p>
        <p className="text-sm font-semibold mb-4">{rupiah(event.harga)}</p>
      </div>

      <div className="flex justify-between items-center text-sm">
        <span className={sisaTiket > 0 ? "text-green-600" : "text-red-600 font-semibold"}>
          {sisaTiket > 0 ? `Sisa tiket: ${sisaTiket}` : "Habis"}
        </span>
        <Link
          href={`/event/${event.id}`}
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
        >
          Detail
        </Link>
      </div>
    </div>
  );
}