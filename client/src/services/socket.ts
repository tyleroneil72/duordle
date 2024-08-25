import io from 'socket.io-client';

const URL: string = '/';
export const socket = io(URL);
