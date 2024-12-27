import { NextResponse } from "next/server";
import connectToDatabase  from "@/lib/dbConnect";
import Game from "@/models/game";

export async function GET(req: Request) {
  try {
    await connectToDatabase();

    const userId = new URL(req.url).searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ message: "Missing userId" }, { status: 400 });
    }

    const game = await Game.findOne({ userId, hasPlayed: true });

    if (game) {
      return NextResponse.json(
        { message: "User has already completed the game", hasPlayed: true },
        { status: 200 }
      );
    }

    return NextResponse.json({ message: "User can play", hasPlayed: false }, { status: 200 });
  } catch (error) {
    console.error("Error checking game status:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
