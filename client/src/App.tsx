import { useState, ChangeEvent } from "react";
import io, { Socket } from "socket.io-client";

// Create a type for the word object to be sent over the socket
type WordObject = {
  room: string;
  word: string;
};

const socket: Socket = io("http://localhost:3000");

function App() {
  const [room, setRoom] = useState<string>("");
  const [word, setWord] = useState<string>("");
  const [receivedWord, setReceivedWord] = useState<string>("");

  const handleCreateRoom = (): void => {
    socket.emit("create_room", room);
  };

  const handleJoinRoom = (): void => {
    socket.emit("join_room", room);
  };

  const handleSetWord = (): void => {
    const payload: WordObject = { room, word };
    socket.emit("set_word", payload);
  };

  socket.on("word_received", (word: string) => {
    setReceivedWord(word);
  });

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6'>
      <div className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
        <input
          type='text'
          value={room}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setRoom(e.target.value)
          }
          placeholder='Room Code'
          className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
        />
        <div className='flex justify-between my-4'>
          <button
            onClick={handleCreateRoom}
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
          >
            Create Room
          </button>
          <button
            onClick={handleJoinRoom}
            className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
          >
            Join Room
          </button>
        </div>
        <input
          type='text'
          value={word}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setWord(e.target.value)
          }
          placeholder='Your Word'
          className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-4 leading-tight focus:outline-none focus:shadow-outline'
        />
        <button
          onClick={handleSetWord}
          className='bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
        >
          Set Word
        </button>
        {receivedWord && (
          <p className='mt-4 text-lg text-gray-800'>
            Received Word: {receivedWord}
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
