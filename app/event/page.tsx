import type { Metadata } from "next";
import { ambilEvents } from "@/data/ambil";
import { rupiah } from "@/data/events";
import { PER_HALAMAN, bacaSaringan, saringEvents } from "@/data/saringan";
import KontrolKatalog from "@/components/KontrolKatalog";
import KartuEvent from "@/components/KartuEvent";

export const metadata: Metadata = { title: "Katalog Event" };

export default async function Katalog({ searchParams }: PageProps<"/event">) {
  const s = bacaSaringan(await searchParams);
  const events = await ambilEvents();
  const tersusun = saringEvents(events, s);

  const jumlahHalaman = Math.max(1, Math.ceil(tersusun.length / PER_HALAMAN));
  const hal = Math.min(s.hal, jumlahHalaman);
  const terlihat = tersusun.slice((hal - 1) * PER_HALAMAN, hal * PER_HALAMAN);

  const daftarKategori = ["Semua", ...new Set(events.map((e) => e.kategori))];
  const totalSisa = tersusun.reduce((t, e) => t + (e.kuota - e.terisi), 0);
  const rataHarga =
    tersusun.length === 0 ? 0 : Math.round(tersusun.reduce((t, e) => t + e.harga, 0) / tersusun.length);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Katalog Event</h1>
      <KontrolKatalog s={s} daftarKategori={daftarKategori} />

      <div className="mb-4 text-sm text-gray-600 flex gap-4">
        <span>Total Event: {tersusun.length}</span>
        <span>Sisa Tiket: {totalSisa}</span>
        <span>Rata-rata Harga: {rupiah(rataHarga)}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
       {terlihat.map((event) => (
          <KartuEvent key={event.id} event={event} />
        ))}
      </div>
    </main>
  );
}