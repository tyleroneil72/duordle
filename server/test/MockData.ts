export const mockRoom = {
  members: ['player1', 'player2'],
  roomCode: 'ABCD',
  word: 'hello',
  board: Array(6)
    .fill(null)
    .map(() => Array(5).fill('')),
  currentRow: 0,
  currentPlayer: 1,
  lastStartingPlayer: 1
};

export const mockWord = {
  word: 'hello',
  difficulty: '1',
  length: 5
};
