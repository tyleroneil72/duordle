import mongoose, { Schema, Document } from "mongoose";

interface IRoom extends Document {
  members: string[];
  roomCode: string;
  word: string;
  board: string[][];
  currentRow: number;
  createdAt: Date;
  checkAndDeleteIfEmpty(): Promise<void>;
}

const RoomSchema: Schema = new Schema(
  {
    members: {
      type: [String],
      required: true,
    },
    roomCode: {
      type: String,
      required: true,
    },
    word: {
      type: String,
      required: true,
    },
    board: {
      type: [[String]],
      required: true,
    },
    currentRow: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: { expires: "3600s" }, // Rooms Total Time To Live: 1 hour
    },
  },
  { timestamps: true }
);

RoomSchema.methods.checkAndDeleteIfEmpty = async function () {
  if (this.members.length === 0) {
    await this.deleteOne();
    console.log(`Room ${this.roomCode} deleted because it became empty.`);
  }
};

export default mongoose.model<IRoom>("Room", RoomSchema);
