"use client";
import { useActionState } from "react";
import { pesanTiket, HasilPesan } from "@/app/actions";
import { Event } from "@/data/events";

const initialState: HasilPesan = {
  berhasil: false,
  pesan: "",
  galat: {},
  isian: { nama: "", email: "" },
};

export default function FormPesan({ event, namaAwal }: { event: Event; namaAwal: string }) {
  const [state, formAction, pending] = useActionState(pesanTiket, {
    ...initialState,
    isian: { nama: namaAwal, email: "" },
  });

  return (
    <form action={formAction} className="max-w-md space-y-4 rounded-xl border bg-white p-6 shadow-sm">
      <input type="hidden" name="eventId" value={event.id} />
      
      {state.pesan && (
        <div className={`p-3 rounded-lg text-sm ${state.berhasil ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
          {state.pesan}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700">Nama Pemesan</label>
        <input 
          type="text" 
          name="nama" 
          defaultValue={state.isian.nama}
          className="mt-1 w-full rounded-lg border p-2 text-sm"
        />
        {state.galat.nama && <p className="mt-1 text-xs text-red-600">{state.galat.nama}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Email</label>
        <input 
          type="email" 
          name="email" 
          defaultValue={state.isian.email}
          className="mt-1 w-full rounded-lg border p-2 text-sm"
        />
        {state.galat.email && <p className="mt-1 text-xs text-red-600">{state.galat.email}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Jumlah Tiket</label>
        <input 
          type="number" 
          name="jumlah" 
          defaultValue={1}
          className="mt-1 w-full rounded-lg border p-2 text-sm"
        />
        {state.galat.jumlah && <p className="mt-1 text-xs text-red-600">{state.galat.jumlah}</p>}
      </div>

      <button 
        type="submit" 
        disabled={pending}
        className="w-full rounded-lg bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-blue-400"
      >
        {pending ? "Memproses..." : "Pesan"}
      </button>
    </form>
  );
}