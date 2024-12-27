import mongoose, { Schema, Document } from "mongoose";

interface IGame extends Document {
  userId: string;
  username: string;
  gameType: string;
  startTime: Date;
  endTime?: Date;
  moves?: number;
  timeTaken?: number;
  hasPlayed?: boolean;
}

const GameSchema: Schema = new Schema({
  userId: { type: String, required: true },
  username: { type: String, required: true },
  gameType: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  moves: { type: Number },
  timeTaken: { type: Number }, // in seconds
  hasPlayed: { type: Boolean, default: false },
});

const Game =
  mongoose.models.Game || mongoose.model<IGame>("Game", GameSchema);

export default Game;
