"use client";
import { useState, useEffect } from "react";

export default function TombolFavorit({ id }: { id: number }) {
  const [isFavorit, setIsFavorit] = useState(false);

  useEffect(() => {
    // @ts-ignore
    const favs = JSON.parse(localStorage.getItem("favorit") || "[]");
    setIsFavorit(favs.includes(id));
  }, [id]);

  const toggleFavorit = () => {
    // @ts-ignore
    const favs = JSON.parse(localStorage.getItem("favorit") || "[]");
    let updated;
    if (isFavorit) {
      updated = favs.filter((item: number) => item !== id);
    } else {
      updated = [...favs, id];
    }
    // @ts-ignore
    localStorage.setItem("favorit", JSON.stringify(updated));
    setIsFavorit(!isFavorit);
  };

  return (
    <button
      onClick={toggleFavorit}
      className="flex items-center gap-2 rounded-lg border bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
    >
      <span>{isFavorit ? "❤️" : "🤍"}</span>
      <span>{isFavorit ? "Disukai" : "Tambah favorit"}</span>
    </button>
  );
}