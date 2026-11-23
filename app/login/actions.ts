"use server";
import { timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NAMA_COOKIE, UMUR_SESI, buatToken } from "@/lib/sesi";

export type HasilMasuk = { pesan: string };

const COOKIE_GAGAL = "login_gagal";
const MAKS_GAGAL = 5;
const DURASI_BLOKIR_MS = 60 * 1000; // 1 menit

function sandiSama(input: string, rahasia: string | undefined): boolean {
  if (!rahasia) return false;
  const bufInput = Buffer.from(input, "utf8");
  const bufRahasia = Buffer.from(rahasia, "utf8");
  if (bufInput.length !== bufRahasia.length) return false;
  return timingSafeEqual(bufInput, bufRahasia);
}

export async function masuk(_sebelum: HasilMasuk, formData: FormData): Promise<HasilMasuk> {
  const sandi = String(formData.get("sandi") ?? "");
  const dari = String(formData.get("dari") ?? "");
  const store = await cookies();

  const sekarang = Date.now();
  const mentahGagal = store.get(COOKIE_GAGAL)?.value ?? "0:0";
  const [gagalStr, blokirStr] = mentahGagal.split(":");
  let jumlahGagal = Number(gagalStr) || 0;
  let blokirSampai = Number(blokirStr) || 0;

  // Jika masa blokir sudah lewat, reset hitungan
  if (blokirSampai > 0 && sekarang >= blokirSampai) {
    jumlahGagal = 0;
    blokirSampai = 0;
  }

  if (blokirSampai > sekarang) {
    const sisaDetik = Math.ceil((blokirSampai - sekarang) / 1000);
    return { pesan: `Terlalu banyak percobaan gagal. Coba lagi dalam ${sisaDetik} detik.` };
  }

  if (!sandiSama(sandi, process.env.ADMIN_PASSWORD)) {
    jumlahGagal += 1;
    const blokirBaru = jumlahGagal >= MAKS_GAGAL ? sekarang + DURASI_BLOKIR_MS : 0;

    store.set(COOKIE_GAGAL, `${jumlahGagal}:${blokirBaru}`, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 5,
    });

    if (blokirBaru > 0) {
      return { pesan: "Terlalu banyak percobaan gagal. Ditolak selama 1 menit." };
    }
    return { pesan: `Kata sandi salah. (${jumlahGagal}/${MAKS_GAGAL})` };
  }

  // Berhasil masuk: hapus cookie hitungan gagal & set cookie sesi admin
  store.delete(COOKIE_GAGAL);

  store.set(NAMA_COOKIE, await buatToken(), {
    httpOnly: true, // tidak terbaca oleh JavaScript di browser
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: UMUR_SESI,
  });

  // hanya boleh kembali ke halaman admin (mencegah dilempar ke situs lain)
  redirect(dari.startsWith("/admin") ? dari : "/admin");
}

export async function keluar() {
  (await cookies()).delete(NAMA_COOKIE);
  redirect("/login");
}