"use client";
import Link from "next/link";
import { Event, rupiah } from "@/data/events";
import { useState, useEffect } from "react";

export default function KartuEvent({ event }: { event: Event }) {
  const [isFavorit, setIsFavorit] = useState(false);

  useEffect(() => {
    // @ts-ignore
    const favs = JSON.parse(localStorage.getItem("favorit") || "[]");
    setIsFavorit(favs.includes(event.id));
  }, [event.id]);

  const toggleFavorit = () => {
    // @ts-ignore
    const favs = JSON.parse(localStorage.getItem("favorit") || "[]");
    let updated;
    if (isFavorit) {
      updated = favs.filter((id: number) => id !== event.id);
    } else {
      updated = [...favs, event.id];
    }
    // @ts-ignore
    localStorage.setItem("favorit", JSON.stringify(updated));
    setIsFavorit(!isFavorit);
  };

  const sisa = event.kuota - event.terisi;

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm relative">
      <button
        onClick={toggleFavorit}
        className="absolute top-4 right-4 text-xl"
        title="Favorit"
      >
        {isFavorit ? "❤️" : "🤍"}
      </button>

      <div className="flex gap-2">
        <span className="rounded bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
          {event.kategori}
        </span>
      </div>

      <h2 className="mt-2 text-lg font-bold text-slate-800">{event.judul}</h2>
      <p className="text-sm text-slate-500">{event.tanggal} · {event.lokasi}</p>

      <div className="mt-4 flex items-center justify-between">
        <div>
          <p className="font-semibold text-blue-600">
            {event.harga === 0 ? "Gratis" : rupiah(event.harga)}
          </p>
          <p className={`text-xs ${sisa === 0 ? "text-red-600 font-semibold" : "text-slate-500"}`}>
            {sisa === 0 ? "Tiket habis" : `Sisa ${sisa} tiket`}
          </p>
        </div>
        <Link
          href={`/event/${event.id}`}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Lihat detail
        </Link>
      </div>
    </div>
  );
}