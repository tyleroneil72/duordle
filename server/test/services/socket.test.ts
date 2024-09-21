import { createServer, Server } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import Client, { Socket } from 'socket.io-client';
import request from 'supertest';
import app from '../../src';
import { initSocketServer } from '../../src/services/socket';
import { mockInvalidWordGuess, mockRoom, mockWord, mockWordTwo } from '../data/mockData';
import { connectInMemoryDb, disconnectInMemoryDb } from '../data/mongodb';

let io: SocketIOServer, clientSocketOne: Socket, clientSocketTwo: Socket;
jest.setTimeout(30000);

describe('Socket.io Server - Valid Operations', () => {
  let httpServer: Server;

  beforeEach(async () => {
    httpServer = createServer();
    await connectInMemoryDb();
    io = initSocketServer(httpServer);
    await request(app).post('/api/word').set('x-api-key', process.env.API_KEY!).send(mockWord);
    await request(app).post('/api/word').set('x-api-key', process.env.API_KEY!).send(mockWordTwo);

    await new Promise<void>((resolve) => {
      httpServer.listen(process.env.PORT || 3000, () => {
        clientSocketOne = Client(process.env.CLIENT_URL || 'http://localhost:3000');
        clientSocketTwo = Client(process.env.CLIENT_URL || 'http://localhost:3000');
        resolve();
      });
    });
  });

  afterEach(async () => {
    clientSocketOne.close();
    clientSocketTwo.close();
    await disconnectInMemoryDb();
    io.close();
    httpServer.close();
  });

  it('should create a room', (done) => {
    clientSocketOne.emit('create_room', mockRoom.roomCode, mockWord.word);

    clientSocketOne.on('room_created', () => {
      const rooms = io.sockets.adapter.rooms;
      const roomExists = rooms.has(mockRoom.roomCode);
      expect(roomExists).toBe(true);
      done();
    });
  });

  it('should join a room', (done) => {
    clientSocketOne.emit('create_room', mockRoom.roomCode, mockWord.word);

    clientSocketOne.on('room_created', () => {
      clientSocketTwo.emit('join_room', mockRoom.roomCode);
    });

    clientSocketTwo.on('room_joined', () => {
      clientSocketOne.on('your_turn', () => {
        expect('your_turn').toBe('your_turn');
        done();
      });
    });
  });

  it('should guess a valid word', (done) => {
    clientSocketOne.emit('create_room', mockRoom.roomCode, mockWord.word);

    clientSocketOne.on('room_created', () => {
      clientSocketTwo.emit('join_room', mockRoom.roomCode);
    });

    clientSocketTwo.on('room_joined', () => {
      clientSocketOne.emit('submit_guess', {
        roomCode: mockRoom.roomCode,
        guess: mockWordTwo.word,
        currentRow: 0
      });
      clientSocketOne.on('valid_word', () => {
        expect('valid_word').toBe('valid_word');
        done();
      });
    });
  });

  it('should guess the correct word and win', (done) => {
    clientSocketOne.emit('create_room', mockRoom.roomCode, mockWordTwo.word);

    clientSocketOne.on('room_created', () => {
      clientSocketTwo.emit('join_room', mockRoom.roomCode);
    });

    clientSocketTwo.on('room_joined', () => {
      clientSocketOne.emit('submit_guess', {
        roomCode: mockRoom.roomCode,
        guess: mockWordTwo.word,
        currentRow: 0
      });

      clientSocketOne.on('game_over', (gameWon: Boolean) => {
        expect(gameWon).toBe(true);
        done();
      });

      clientSocketOne.on('invalid_word', (msg) => {
        console.log('Invalid word:', msg);
        done(`Expected a valid word but got invalid_word with message: ${msg}`);
      });
    });
  });

  it('should start a new game', (done) => {
    clientSocketOne.emit('create_room', mockRoom.roomCode, mockWord.word);

    clientSocketOne.on('room_created', () => {
      clientSocketTwo.emit('join_room', mockRoom.roomCode);
    });
    clientSocketTwo.on('room_joined', () => {
      clientSocketOne.emit('start_new_game', mockRoom.roomCode);
      clientSocketOne.on('new_game_started', (newWord: string) => {
        expect('new_game_started').toBe('new_game_started');
        done();
      });
    });
  });

  it('should leave a room', (done) => {
    clientSocketOne.emit('create_room', mockRoom.roomCode, mockWord.word);

    clientSocketOne.on('room_created', () => {
      clientSocketTwo.emit('join_room', mockRoom.roomCode);
    });
    clientSocketTwo.on('room_joined', () => {
      clientSocketOne.emit('leave_room', mockRoom.roomCode);
      clientSocketTwo.on('player_left', () => {
        const rooms = io.sockets.adapter.rooms;
        const room = rooms.get(mockRoom.roomCode);
        if (room && clientSocketOne.id) {
          const socketInRoom = room.has(clientSocketOne.id);
          expect(socketInRoom).toBe(false);
          done();
        }
      });
    });
  });
});

describe('Socket.io Server - Invalid Operations', () => {
  let httpServer: Server;

  beforeEach(async () => {
    httpServer = createServer();
    await connectInMemoryDb();
    io = initSocketServer(httpServer);
    await request(app).post('/api/word').set('x-api-key', process.env.API_KEY!).send(mockWord);
    await request(app).post('/api/word').set('x-api-key', process.env.API_KEY!).send(mockWordTwo);

    await new Promise<void>((resolve) => {
      httpServer.listen(process.env.PORT || 3000, () => {
        clientSocketOne = Client(process.env.CLIENT_URL || 'http://localhost:3000');
        clientSocketTwo = Client(process.env.CLIENT_URL || 'http://localhost:3000');
        resolve();
      });
    });
  });

  afterEach(async () => {
    clientSocketOne.close();
    clientSocketTwo.close();
    await disconnectInMemoryDb();
    io.close();
    httpServer.close();
  });

  it('should not create a room with an existing room code', (done) => {
    clientSocketOne.emit('create_room', mockRoom.roomCode, mockWord.word);

    clientSocketOne.on('room_created', () => {
      clientSocketTwo.emit('create_room', mockRoom.roomCode, mockWord.word);
    });

    clientSocketTwo.on('room_already_exists', () => {
      expect('room_already_exists').toBe('room_already_exists');
      done();
    });
  });

  it('should guess an invalid word', (done) => {
    clientSocketOne.emit('create_room', mockRoom.roomCode, mockWord.word);

    clientSocketOne.on('room_created', () => {
      clientSocketTwo.emit('join_room', mockRoom.roomCode);
    });
    clientSocketTwo.on('room_joined', () => {
      clientSocketOne.emit('submit_guess', {
        roomCode: mockRoom.roomCode,
        guess: mockInvalidWordGuess.word,
        currentRow: 0
      });
      clientSocketOne.on('invalid_word', () => {
        expect('invalid_word').toBe('invalid_word');
        done();
      });
    });
  });

  it('should not guess a word when it is not your turn', (done) => {
    clientSocketOne.emit('create_room', mockRoom.roomCode, mockWord.word);

    clientSocketOne.on('room_created', () => {
      clientSocketTwo.emit('join_room', mockRoom.roomCode);
    });

    clientSocketTwo.on('room_joined', () => {
      clientSocketTwo.emit('submit_guess', {
        roomCode: mockRoom.roomCode,
        guess: mockWord.word,
        currentRow: 0
      });
      clientSocketTwo.on('not_your_turn', () => {
        expect('not_your_turn').toBe('not_your_turn');
        done();
      });
    });
  });

  it('should remove jest warning', (done) => {
    setTimeout(() => {
      expect('jest').toBe('jest');
      done();
    }, 2000);
  });
});
