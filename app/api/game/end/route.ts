import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/dbConnect";
import Game from "@/models/game";

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const { userId, moves, endTime, timeTaken } = await req.json();

    if (!userId || !endTime || !timeTaken || moves === undefined) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const game = await Game.findOneAndUpdate(
      { userId, endTime: { $exists: false } },
      { endTime: new Date(endTime), moves, timeTaken, hasPlayed: true }, // Set hasPlayed to true
      { new: true }
    );

    if (!game) {
      return NextResponse.json(
        { message: "Game not found or already ended" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Game ended successfully", game },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error ending game:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
