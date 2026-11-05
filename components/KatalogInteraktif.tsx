"use client";

import { useState } from "react";
import type { Event } from "@/data/events";
import { rupiah } from "@/data/events";
import KartuEvent from "./KartuEvent";
import KontrolKatalog from "./KontrolKatalog";

export default function KatalogInteraktif({
  events,
}: {
  events: Event[];
}) {
  const [cari, setCari] = useState("");
  const [kategori, setKategori] = useState("Semua");
  const [urut, setUrut] = useState("tanggal");
  const [jumlahTampil, setJumlahTampil] = useState(4);
  const [hanyaAdaTiket, setHanyaAdaTiket] = useState(false);
  const [hargaMaksimal, setHargaMaksimal] = useState("");

  const daftarKategori = [
    "Semua",
    ...new Set(events.map((e) => e.kategori)),
  ];

  const hasil = events.filter((e) => {
    const cocokJudul = e.judul
      .toLowerCase()
      .includes(cari.toLowerCase());

    const cocokKategori =
      kategori === "Semua" || e.kategori === kategori;

    const tersedia = e.kuota - e.terisi > 0;
    const cocokTiket = !hanyaAdaTiket || tersedia;

    const cocokHarga =
      hargaMaksimal === "" ||
      e.harga <= Number(hargaMaksimal);

    return cocokJudul && cocokKategori && cocokTiket && cocokHarga;
  });

  const tersusun = [...hasil].sort((a, b) => {
    if (urut === "murah") return a.harga - b.harga;
    if (urut === "mahal") return b.harga - a.harga;
    if (urut === "nama") return a.judul.localeCompare(b.judul);
    return a.tanggal.localeCompare(b.tanggal);
  });

  const rataRataHarga =
    tersusun.length > 0
      ? tersusun.reduce((total, e) => total + e.harga, 0) /
        tersusun.length
      : 0;

  const totalSisaTiket = tersusun.reduce(
    (total, e) => total + (e.kuota - e.terisi),
    0
  );

  const eventTampil = tersusun.slice(0, jumlahTampil);

  function resetTampilan() {
    setJumlahTampil(4);
  }

  return (
    <div>
      <KontrolKatalog
        cari={cari}
        setCari={setCari}
        kategori={kategori}
        setKategori={setKategori}
        daftarKategori={daftarKategori}
        urut={urut}
        setUrut={setUrut}
        hanyaAdaTiket={hanyaAdaTiket}
        setHanyaAdaTiket={setHanyaAdaTiket}
        hargaMaksimal={hargaMaksimal}
        setHargaMaksimal={setHargaMaksimal}
        resetTampilan={resetTampilan}
      />

      <p className="mb-2 text-sm text-slate-500">
        {tersusun.length} event ditemukan
      </p>

      <p className="mb-4 text-sm text-slate-600">
        Rata-rata harga {rupiah(Math.round(rataRataHarga))}.
        Total sisa tiket {totalSisaTiket}.
      </p>

      {tersusun.length === 0 ? (
        <p className="text-slate-500">
          Tidak ada event yang cocok.
        </p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {eventTampil.map((e) => (
              <KartuEvent key={e.id} event={e} />
            ))}
          </div>

          {jumlahTampil < tersusun.length && (
            <div className="mt-6 text-center">
              <button
                onClick={() =>
                  setJumlahTampil((sebelumnya) => sebelumnya + 4)
                }
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
              >
                Tampilkan lagi
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}