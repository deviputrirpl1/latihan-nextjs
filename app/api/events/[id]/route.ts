import { NextResponse } from "next/server";
import { events } from "@/data/events";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const resolvedParams = await params;
  const event = events.find((e) => e.id === Number(resolvedParams.id));

  if (!event) {
    return NextResponse.json(
      { pesan: "Event tidak ditemukan" },
      { status: 404 }
    );
  }

  return NextResponse.json(event);
}