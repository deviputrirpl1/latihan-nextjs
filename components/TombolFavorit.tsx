"use client";

import { useState } from "react";

export default function TombolFavorit({ id }: { id: string | number }) {
  const [isFavorit, setIsFavorit] = useState(() => {
    try {
      const win = (globalThis as unknown) as { localStorage?: { getItem: (key: string) => string | null } };
      if (!win.localStorage) return false;
      const favs = JSON.parse(win.localStorage.getItem("favorit") || "[]");
      return favs.includes(id);
    } catch {
      return false;
    }
  });

  const toggleFavorit = () => {
    try {
      const win = (globalThis as unknown) as { localStorage?: { getItem: (key: string) => string | null; setItem: (key: string, value: string) => void } };
      if (!win.localStorage) return;
      const favs = JSON.parse(win.localStorage.getItem("favorit") || "[]");
      let updated;
      if (favs.includes(id)) {
        updated = favs.filter((item: string | number) => item !== id);
      } else {
        updated = [...favs, id];
      }
      win.localStorage.setItem("favorit", JSON.stringify(updated));
      setIsFavorit(!isFavorit);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <button
      onClick={toggleFavorit}
      className={`px-4 py-2 rounded text-white font-semibold ${
        isFavorit ? "bg-red-500 hover:bg-red-600" : "bg-gray-400 hover:bg-gray-500"
      }`}
    >
      {isFavorit ? "♥ Favorit" : "♡ Tambah ke Favorit"}
    </button>
  );
}