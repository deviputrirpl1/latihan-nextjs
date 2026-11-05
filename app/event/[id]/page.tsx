
import { notFound } from "next/navigation";
import Link from "next/link";
import { events, rupiah } from "@/data/events";
import FormPesan from "@/components/FormPesan";
import TombolFavorit from "@/components/TombolFavorit";

export default async function Detail({
  params,
}: PageProps<"/event/[id]">) {
  const { id } = await params;
  const event = events.find((e) => e.id === Number(id));

  if (!event) notFound();

  const sisa = event.kuota - event.terisi;

  const eventTerkait = events.filter(
    (e) => e.kategori === event.kategori && e.id !== event.id
  );

  return (
    <article className="rounded-xl border bg-white p-6">
      <Link
        href="/event"
        className="mb-4 inline-block text-sm text-blue-600 underline"
      >
        ← Kembali ke katalog
      </Link>

      <span className="block w-max rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
        {event.kategori}
      </span>

      <h1 className="mt-2 text-3xl font-bold">
        {event.judul}
      </h1>

      <p className="mt-1 text-slate-500">
        {event.tanggal} · {event.lokasi}
      </p>

      <p className="mt-4 text-xl font-semibold">
        {rupiah(event.harga)}
      </p>

      <p className="text-slate-600">
        Sisa {sisa} dari {event.kuota} tiket
      </p>

      <TombolFavorit id={event.id} />

      <FormPesan event={event} />

      <section className="mt-8 border-t pt-6">
        <h2 className="mb-4 text-xl font-bold">
          Event Terkait
        </h2>

        {eventTerkait.length === 0 ? (
          <p className="text-slate-500">
            Belum ada event terkait.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {eventTerkait.map((e) => (
              <div
                key={e.id}
                className="rounded-lg border p-4"
              >
                <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-700">
                  {e.kategori}
                </span>

                <h3 className="mt-2 font-semibold">
                  {e.judul}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {e.tanggal} · {e.lokasi}
                </p>

                <p className="mt-2 font-medium">
                  {rupiah(e.harga)}
                </p>

                <Link
                  href={`/event/${e.id}`}
                  className="mt-3 inline-block rounded bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
                >
                  Lihat detail
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </article>
  );
}
