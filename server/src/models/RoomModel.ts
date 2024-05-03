import mongoose, { Schema, Document } from "mongoose";

interface IRoom extends Document {
  members: string[];
  roomCode: string;
  word: string;
}

const RoomSchema: Schema = new Schema(
  {
    members: {
      type: [String],
      required: false,
    },
    roomCode: {
      type: String,
      required: true,
    },
    word: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IRoom>("Room", RoomSchema);
