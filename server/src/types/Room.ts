export interface Room {
  members: string[];
  roomCode: string;
  word: string;
  board: string[][];
  currentRow: number;
  currentPlayer: number;
  lastStartingPlayer: number;
}
