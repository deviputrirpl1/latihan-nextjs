import { NextResponse } from "next/server";
import { events } from "@/data/events";

type Props = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, { params }: Props) {
  const { id } = await params;
  const event = events.find((e) => e.id === Number(id));

  if (!event) {
    return NextResponse.json({ pesan: "Event tidak ditemukan." }, { status: 404 });
  }

  return NextResponse.json(event);
}