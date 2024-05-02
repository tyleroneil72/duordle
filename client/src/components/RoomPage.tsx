import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";

// Initialize the socket connection outside the component if it doesn't change
const socket = io("http://localhost:3000"); // Update this URL to your server's URL

function RoomPage() {
  const { roomCode } = useParams();
  const [word, setWord] = useState("");
  const [receivedWord, setReceivedWord] = useState("");

  useEffect(() => {
    if (roomCode) {
      // Join the room when the component mounts
      socket.emit("join_room", roomCode);

      // Listen for words received from the server
      socket.on("word_received", (word) => {
        setReceivedWord(word);
      });

      // Cleanup the effect when the component unmounts
      return () => {
        socket.off("word_received");
      };
    }
  }, [roomCode]);

  const handleSetWord = () => {
    if (word) {
      // Emit the 'set_word' event to the server
      socket.emit("set_word", { room: roomCode, word });
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6'>
      <div className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
        <h2 className='text-lg font-bold mb-4'>Room: {roomCode}</h2>
        <input
          type='text'
          value={word}
          onChange={(e) => setWord(e.target.value)}
          placeholder='Set Your Word'
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

export default RoomPage;
