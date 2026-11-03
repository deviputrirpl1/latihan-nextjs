
"use client";

import { useState } from "react";
import type { Event } from "@/data/events";
import KartuEvent from "./KartuEvent";

export default function KatalogInteraktif({
  events,
}: {
  events: Event[];
}) {
  const [cari, setCari] = useState("");
  const [kategori, setKategori] = useState("Semua");
  const [hanyaAdaTiket, setHanyaAdaTiket] = useState(false);

  const daftarKategori = [
    "Semua",
    ...new Set(events.map((e) => e.kategori)),
  ];

  const hasil = events.filter((e) => {
    const cocokJudul = (e.judul || "")
      .toLowerCase()
      .includes(cari.toLowerCase());

    const cocokKategori =
      kategori === "Semua" || e.kategori === kategori;

    const tersedia = e.kuota - e.terisi > 0;

    return (
      cocokJudul &&
      cocokKategori &&
      (!hanyaAdaTiket || tersedia)
    );
  });

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          type="text"
          value={cari}
          onChange={(e) =>
            setCari(
              (e.target as unknown as { value: string }).value
            )
          }
          placeholder="Cari event..."
          className="rounded border bg-white px-3 py-2"
        />

        <select
          value={kategori}
          onChange={(e) =>
            setKategori(
              (e.target as unknown as { value: string }).value
            )
          }
          className="rounded border bg-white px-3 py-2"
        >
          {daftarKategori.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>

        <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
          <input
            type="checkbox"
            checked={hanyaAdaTiket}
            onChange={(e) =>
              setHanyaAdaTiket(
                (e.target as unknown as { checked: boolean }).checked
              )
            }
            className="rounded border-slate-300"
          />
          Hanya yang masih ada tiket
        </label>
      </div>

      {hasil.length === 0 ? (
        <p className="text-slate-500">
          Tidak ada event yang cocok.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {hasil.map((e) => (
            <KartuEvent key={e.id} event={e} />
          ))}
        </div>
      )}
    </div>
  );
}
