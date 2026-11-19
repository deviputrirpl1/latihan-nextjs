import { supabase } from "@/lib/supabase";
import type { Event } from "@/data/events";
import { events as localEvents } from "@/data/events";

export async function ambilEvents(): Promise<Event[]> {
  try {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("tanggal");

    if (error || !data || data.length === 0) {
      return localEvents;
    }

    return data as Event[];
  } catch {
    return localEvents;
  }
}

export async function ambilEvent(
  id: string | number
): Promise<Event | undefined> {
  try {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", id)
      .single();

    if (!error && data) {
      return data as Event;
    }
  } catch {
    // fallback ke data lokal di bawah
  }

  return localEvents.find((item) => String(item.id) === String(id));
}

export async function ambilTerkait(
  event: Event,
  limit = 3
): Promise<Event[]> {
  try {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("kategori", event.kategori)
      .neq("id", event.id)
      .limit(limit);

    if (!error && data && data.length > 0) {
      return (data as Event[]).filter(
        (item): item is Event => Boolean(item && item.id !== undefined)
      );
    }
  } catch {
    // fallback ke data lokal di bawah
  }

  const validLocal = localEvents.filter(
    (item): item is Event => Boolean(item && item.id !== undefined)
  );

  const samaKategori = validLocal.filter(
    (item) =>
      String(item.id) !== String(event.id) &&
      item.kategori === event.kategori
  );

  if (samaKategori.length > 0) {
    return samaKategori.slice(0, limit);
  }

  return validLocal
    .filter((item) => String(item.id) !== String(event.id))
    .slice(0, limit);
}