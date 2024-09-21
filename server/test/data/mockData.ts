import { Room } from '../../src/types/Room';
import { Word } from '../../src/types/Word';

export const mockRoom: Room = {
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

export const mockInvalidRoom = {
  members: ['player1', 'player2'],
  roomCode: 'ABCD',
  board: Array(6)
    .fill(null)
    .map(() => Array(5).fill('')),
  currentRow: 0,
  currentPlayer: 1,
  lastStartingPlayer: 1
};

export const mockWord: Word = {
  word: 'hello',
  difficulty: '1',
  length: 5
};

export const mockIncorrectWord: Word = {
  word: 'world',
  difficulty: '1',
  length: 5
};

export const mockInvalidWord = {
  word: 'hello',
  length: 5
};

export const mockInvalidApiKey: string = 'INVALID_API_KEY';

export const maxTests: number = 10;
