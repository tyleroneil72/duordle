import mongoose, { Schema, Document } from "mongoose";

interface IRoom extends Document {
  members: string[];
  roomCode: string;
  word: string;
  createdAt: Date;
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
    createdAt: {
      type: Date,
      default: Date.now,
      index: { expires: "3600s" }, // Rooms Total Time To Live: 1 hour
    },
  },
  { timestamps: true }
);

export default mongoose.model<IRoom>("Room", RoomSchema);
