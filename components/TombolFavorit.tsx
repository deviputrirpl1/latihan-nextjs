"use client";

import { useState } from "react";

type Penyimpanan = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
};

export default function TombolFavorit({ id }: { id: number }) {
  function ambilPenyimpanan() {
    return (globalThis as unknown as {
      localStorage: Penyimpanan;
    }).localStorage;
  }

  // Mengisi nilai awal state langsung dari localStorage saat komponen dimuat
  const [favorit, setFavorit] = useState(() => {
    const simpan: number[] = JSON.parse(
      ambilPenyimpanan().getItem("favorit") ?? "[]"
    );
    return simpan.includes(id);
  });

  function ubah() {
    const storage = ambilPenyimpanan();

    const simpan: number[] = JSON.parse(
      storage.getItem("favorit") ?? "[]"
    );

    const baru = simpan.includes(id)
      ? simpan.filter((x) => x !== id)
      : [...simpan, id];

    storage.setItem("favorit", JSON.stringify(baru));
    setFavorit(baru.includes(id));
  }

  return (
    <button
      onClick={ubah}
      className="mt-3 rounded border px-3 py-1.5 text-sm"
    >
      {favorit ? "♥ Favorit" : "♡ Tambah favorit"}
    </button>
  );
}