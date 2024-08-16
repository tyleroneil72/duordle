import mongoose, { Schema, Document } from 'mongoose';

interface IWord extends Document {
  word: string;
  difficulty: string;
  length: number;
}
// Difficulty of 1 means it is a valid word for the game to use as solving word
// Difficulty of 0 means it is a valid word but not suitable for the answer, just a guess
const WordSchema: Schema = new Schema(
  {
    word: {
      type: String,
      required: true
    },
    difficulty: {
      type: String,
      required: true
    },
    length: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

WordSchema.pre<IWord>('save', function (next) {
  if (this.isModified('word')) {
    this.length = this.word.length;
  }
  next();
});

export default mongoose.model<IWord>('Word', WordSchema);
