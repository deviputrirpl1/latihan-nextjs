"use client";

import { useActionState } from "react";
import { pesanTiket, HasilPesan } from "@/app/actions";
import { useState } from "react";

const initialState: HasilPesan = {
  berhasil: false,
  pesan: "",
  galat: {},
  isian: { nama: "", email: "" },
};

export default function FormPesan({ event }: { event: any }) {
  const [state, formAction, isPending] = useActionState(pesanTiket, initialState);
  const [jumlah, setJumlah] = useState(1);

  return (
    <form action={formAction} className="mt-6 space-y-4">
      <input type="hidden" name="eventId" value={event.id} />

      <div>
        <label className="block text-sm font-medium">Nama Pemesan</label>
        <input
          type="text"
          name="nama"
          defaultValue={state.isian.nama}
          className="mt-1 block w-full rounded border px-3 py-2"
        />
        {state.galat.nama && (
          <p className="text-sm text-red-600">{state.galat.nama}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Alamat Email</label>
        <input
          type="email"
          name="email"
          defaultValue={state.isian.email}
          className="mt-1 block w-full rounded border px-3 py-2"
        />
        {state.galat.email && (
          <p className="text-sm text-red-600">{state.galat.email}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Jumlah Tiket</label>
        <input
          type="number"
          name="jumlah"
          value={jumlah}
          onChange={(e: any) => setJumlah(Number(e.target.value))}
          className="mt-1 block w-32 rounded border px-3 py-2"
        />
        {state.galat.jumlah && (
          <p className="text-sm text-red-600">{state.galat.jumlah}</p>
        )}
      </div>

      <p>
        Total: <b>Rp {(event.harga * jumlah).toLocaleString("id-ID")}</b>
      </p>

      <button
        type="submit"
        disabled={isPending}
        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {isPending ? "Memproses..." : "Pesan"}
      </button>

      {state.pesan && (
        <p className={state.berhasil ? "text-green-700" : "text-red-600"}>
          {state.pesan}
        </p>
      )}
    </form>
  );
}