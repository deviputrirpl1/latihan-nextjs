"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { Event } from "@/data/events";

// Fungsi helper untuk format rupiah
const formatRupiah = (angka: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(angka);
};

export default function DaftarFavorit() {
  const [semua, setSemua] = useState<Event[]>([]);
  const [ids, setIds] = useState<number[]>([]);
  const [memuat, setMemuat] = useState(true);
  const [galat, setGalat] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    const stored = (globalThis as unknown as { localStorage: any }).localStorage?.getItem("favorit");
    const localIds = JSON.parse(stored ?? "[]");
    setIds(localIds);

    fetch("/api/events")
      .then((r) => {
        if (!r.ok) throw new Error("Gagal mengambil data");
        return r.json() as Promise<Event[]>;
      })
      .then((d) => setSemua(d))
      .catch((e: Error) => setGalat(e.message))
      .finally(() => setMemuat(false));
  }, []);

  if (memuat) return <p>Memuat...</p>;
  if (galat) return <p className="text-red-600">{galat}</p>;

  const daftar = semua.filter((e) => ids.includes(e.id));
  if (daftar.length === 0) return <p className="text-slate-500">Belum ada favorit.</p>;

  return (
    <ul className="space-y-2">
      {daftar.map((e) => (
        <li key={e.id} className="flex items-center justify-between border-b pb-2">
          <Link href={`/event/${e.id}`} className="text-blue-600 hover:underline font-medium">
            {e.judul}
          </Link>
          <span className="text-slate-700 font-semibold">{formatRupiah(e.harga)}</span>
        </li>
      ))}
    </ul>
  );
}