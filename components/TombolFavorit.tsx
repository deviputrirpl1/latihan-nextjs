"use client";

import { useState, useEffect } from "react";

type Penyimpanan = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
};

export default function TombolFavorit({ id }: { id: number }) {
  const [mounted, setMounted] = useState(false);
  const [favorit, setFavorit] = useState(false);

  function ambilPenyimpanan(): Penyimpanan {
    const globalObj = globalThis as unknown as {
      localStorage?: Penyimpanan;
    };
    if (globalObj.localStorage) {
      return globalObj.localStorage;
    }
    return {
      getItem: () => null,
      setItem: () => {},
    };
  }

  useEffect(() => {
    setMounted(true);
    const storage = ambilPenyimpanan();
    const data = storage.getItem("favorit") ?? "[]";
    const simpan: number[] = JSON.parse(data);
    setFavorit(simpan.includes(id));
  }, [id]);

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

  // Sebelum dimount di client, jangan render status favorit yang berbeda untuk mencegah hydration mismatch
  if (!mounted) {
    return (
      <button className="mt-3 rounded border px-3 py-1.5 text-sm">
        ♡ Tambah favorit
      </button>
    );
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