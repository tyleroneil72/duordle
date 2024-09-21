import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import Client from 'socket.io-client';
import { initSocketServer } from '../../src/services/socket';
import { connectInMemoryDb, disconnectInMemoryDb } from '../data/mongodb';

let io: SocketIOServer, clientSocketOne: any, clientSocketTwo: any;

describe('Socket.io Server - Valid Operations', () => {
  let httpServer: any;

  beforeAll(async () => {
    httpServer = createServer();
    await connectInMemoryDb();
    io = initSocketServer(httpServer);

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
    clientSocketOne.emit('create_room', '1234', 'apple');

    clientSocketOne.on('room_created', () => {
      const rooms = io.sockets.adapter.rooms;
      console.log(rooms);
      const roomExists = rooms.has('1234');
      expect(roomExists).toBe(true);
      done();
    });
  });
});
