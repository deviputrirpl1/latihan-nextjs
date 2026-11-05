"use client";

type Props = {
  cari: string;
  setCari: (val: string) => void;
  kategori: string;
  setKategori: (val: string) => void;
  daftarKategori: string[];
  urut: string;
  setUrut: (val: string) => void;
  hanyaAdaTiket: boolean;
  setHanyaAdaTiket: (val: boolean) => void;
  hargaMaksimal: string;
  setHargaMaksimal: (val: string) => void;
  resetTampilan: () => void;
};

export default function KontrolKatalog({
  cari,
  setCari,
  kategori,
  setKategori,
  daftarKategori,
  urut,
  setUrut,
  hanyaAdaTiket,
  setHanyaAdaTiket,
  hargaMaksimal,
  setHargaMaksimal,
  resetTampilan,
}: Props) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-3">
      <input
        type="text"
        value={cari}
        onChange={(e: any) => {
          setCari(e.target.value);
          resetTampilan();
        }}
        placeholder="Cari event..."
        className="rounded border bg-white px-3 py-2"
      />

      <select
        value={kategori}
        onChange={(e: any) => {
          setKategori(e.target.value);
          resetTampilan();
        }}
        className="rounded border bg-white px-3 py-2"
      >
        {daftarKategori.map((k) => (
          <option key={k} value={k}>
            {k}
          </option>
        ))}
      </select>

      <select
        value={urut}
        onChange={(e: any) => {
          setUrut(e.target.value);
          resetTampilan();
        }}
        className="rounded border bg-white px-3 py-2"
      >
        <option value="tanggal">Tanggal terdekat</option>
        <option value="murah">Harga termurah</option>
        <option value="mahal">Harga termahal</option>
        <option value="nama">Nama A-Z</option>
      </select>

      <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={hanyaAdaTiket}
          onChange={(e: any) => {
            setHanyaAdaTiket(e.target.checked);
            resetTampilan();
          }}
          className="rounded border-slate-300"
        />
        Hanya yang masih ada tiket
      </label>

      <input
        type="number"
        min="0"
        value={hargaMaksimal}
        onChange={(e: any) => {
          setHargaMaksimal(e.target.value);
          resetTampilan();
        }}
        placeholder="Harga maksimal"
        className="w-40 rounded border bg-white px-3 py-2"
      />
    </div>
  );
}