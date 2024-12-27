import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/dbConnect";
import Game from "@/models/game";

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const { userId, username, gameType, startTime } = await req.json();

    if (!userId || !username || !gameType || !startTime) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const newGame = new Game({
      userId,
      username,
      gameType,
      startTime: new Date(startTime),
    });

    await newGame.save();

    return NextResponse.json(
      { message: "Game started successfully", game: newGame },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error starting game:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
