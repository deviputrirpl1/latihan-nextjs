import { events, rupiah } from "@/data/events";
import FormPesan from "@/components/FormPesan";
import Link from "next/link";
import { cookies } from "next/headers";
import TombolFavorit from "@/components/TombolFavorit";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function HalamanDetailEvent({ params }: Props) {
  const { id } = await params;
  const event = events.find((e) => e.id === Number(id));

  if (!event) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold">Event tidak ditemukan</h1>
        <Link href="/event" className="text-blue-600 underline">Kembali ke katalog</Link>
      </div>
    );
  }

  const sisa = event.kuota - event.terisi;
  const namaAwal = (await cookies()).get("nama")?.value ?? "";

  // Mencari event terkait (event lain dengan kategori yang sama atau selain event ini)
  const eventTerkait = events.filter((e) => e.id !== event.id).slice(0, 1);

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        {/* Tombol Kembali ke Katalog */}
        <Link href="/event" className="text-sm text-blue-600 underline">
          ← Kembali ke katalog
        </Link>

        {/* Kategori */}
        <div className="mt-3">
          <span className="rounded bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
            {event.kategori}
          </span>
        </div>

        {/* Judul & Detail Utama */}
        <h1 className="mt-1 text-2xl font-bold text-slate-900">{event.judul}</h1>
        <p className="text-sm text-slate-500">
          {event.tanggal} · {event.lokasi}
        </p>

        {/* Harga & Sisa Tiket */}
        <div className="mt-3">
          <p className="text-xl font-bold text-blue-600">
            {event.harga === 0 ? "Gratis" : rupiah(event.harga)}
          </p>
          <p className="text-sm text-slate-600">
            Sisa {sisa} dari {event.kuota} tiket
          </p>
        </div>

        {/* Tombol Favorit */}
        <div className="mt-3">
          <TombolFavorit id={event.id} />
        </div>

        {/* Garis Pembatas */}
        <hr className="my-5 border-slate-200" />

        {/* Form Pemesanan */}
        <div>
          <h2 className="mb-3 font-bold text-slate-800">Pesan tiket</h2>
          <FormPesan event={event} namaAwal={namaAwal} />
        </div>

        {/* Garis Pembatas */}
        <hr className="my-5 border-slate-200" />

        {/* Bagian Event Terkait */}
        <div>
          <h3 className="mb-2 font-bold text-slate-800">Event terkait</h3>
          {eventTerkait.length > 0 ? (
            eventTerkait.map((terkait) => (
              <Link
                key={terkait.id}
                href={`/event/${terkait.id}`}
                className="text-sm text-blue-600 underline block"
              >
                {terkait.judul}
              </Link>
            ))
          ) : (
            <p className="text-sm text-slate-400">Tidak ada event terkait.</p>
          )}
        </div>
      </div>
    </div>
  );
}