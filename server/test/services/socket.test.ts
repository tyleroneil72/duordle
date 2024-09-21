import { createServer, Server } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import Client, { Socket } from 'socket.io-client';
import request from 'supertest';
import app from '../../src';
import { initSocketServer } from '../../src/services/socket';
import { mockIncorrectWord, mockRoom, mockWord } from '../data/mockData';
import { connectInMemoryDb, disconnectInMemoryDb } from '../data/mongodb';

let io: SocketIOServer, clientSocketOne: Socket, clientSocketTwo: Socket;

describe('Socket.io Server - Valid Operations', () => {
  let httpServer: Server;

  beforeAll(async () => {
    httpServer = createServer();
    await connectInMemoryDb();
    io = initSocketServer(httpServer);
    await request(app).post('/api/word').set('x-api-key', process.env.API_KEY!).send(mockWord);
    await request(app).post('/api/word').set('x-api-key', process.env.API_KEY!).send(mockIncorrectWord);

    await new Promise<void>((resolve) => {
      httpServer.listen(process.env.PORT || 3000, () => {
        clientSocketOne = Client(process.env.CLIENT_URL || 'http://localhost:3000');
        clientSocketTwo = Client(process.env.CLIENT_URL || 'http://localhost:3000');
        resolve();
      });
    });
  });

  afterAll(async () => {
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
    clientSocketTwo.emit('join_room', mockRoom.roomCode);

    clientSocketTwo.on('room_joined', () => {
      setTimeout(() => {
        const rooms = io.sockets.adapter.rooms;
        const room = rooms.get(mockRoom.roomCode);
        if (room && clientSocketTwo.id) {
          const socketInRoom = room.has(clientSocketTwo.id);
          expect(socketInRoom).toBe(true);
          done();
        }
      }, 50);
    });
  });

  it('should guess a valid word', (done) => {
    clientSocketOne.emit('submit_guess', {
      roomCode: mockRoom.roomCode,
      guess: mockIncorrectWord.word,
      currentRow: 0
    });
    clientSocketOne.on('valid_word', () => {
      expect('valid_word').toBe('valid_word');
      done();
    });
    clientSocketOne.on('invalid_word', () => {
      expect('invalid_word').toBe('valid_word');
      done();
    });
  });

  it('should guess the correct word and win', (done) => {
    clientSocketTwo.emit('submit_guess', {
      roomCode: mockRoom.roomCode,
      guess: mockWord.word,
      currentRow: 0
    });
    clientSocketOne.on('game_over', (gameWon: Boolean) => {
      expect(gameWon).toBe(true);
      done();
    });
    clientSocketOne.on('invalid_word', () => {
      expect('invalid_word').toBe('valid_word');
      done();
    });
  });

  it('should start a new game', (done) => {
    clientSocketOne.emit('start_new_game', mockRoom.roomCode);
    clientSocketOne.on('new_game_started', (newWord: string) => {
      expect('new_game_started').toBe('new_game_started');
      done();
    });
  });

  it('should leave a room', (done) => {
    clientSocketOne.emit('leave_room', mockRoom.roomCode);
    clientSocketTwo.on('player_left', () => {
      const rooms = io.sockets.adapter.rooms;
      const room = rooms.get(mockRoom.roomCode);
      console.log(room);
      if (room && clientSocketOne.id) {
        const socketInRoom = room.has(clientSocketOne.id);
        expect(socketInRoom).toBe(false);
        done();
      }
    });
  });
});

// describe('Socket.io Server - Invalid Operations', () => {
//   let httpServer: Server;

//   beforeAll(async () => {
//     httpServer = createServer();
//     await connectInMemoryDb();
//     io = initSocketServer(httpServer);
//     await request(app).post('/api/word').set('x-api-key', process.env.API_KEY!).send(mockWord);
//     await request(app).post('/api/word').set('x-api-key', process.env.API_KEY!).send(mockIncorrectWord);

//     await new Promise<void>((resolve) => {
//       httpServer.listen(process.env.PORT || 3000, () => {
//         clientSocketOne = Client(process.env.CLIENT_URL || 'http://localhost:3000');
//         clientSocketTwo = Client(process.env.CLIENT_URL || 'http://localhost:3000');
//         resolve();
//       });
//     });
//   });

//   afterAll(async () => {
//     clientSocketOne.close();
//     clientSocketTwo.close();
//     await disconnectInMemoryDb();
//     io.close();
//     httpServer.close();
//   });
// });
