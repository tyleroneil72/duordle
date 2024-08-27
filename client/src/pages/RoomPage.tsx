import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { socket } from '../services/socket';
import GameBoard from '../components/GameBoard';
import Keyboard from '../components/Keyboard';
import Waiting from '../components/Waiting';
import GameOver from '../components/GameOver';
import { IoMdMenu } from 'react-icons/io';

const RoomPage: React.FC = () => {
  const { roomCode } = useParams<{ roomCode: string }>();
  const navigate = useNavigate();
  const [word, setWord] = useState<string>('');
  const [currentAttempt, setCurrentAttempt] = useState<string[]>(Array(5).fill(''));
  const [board, setBoard] = useState<string[][]>(
    Array(6)
      .fill(null)
      .map(() => Array(5).fill(''))
  );
  const [currentRow, setCurrentRow] = useState<number>(0);
  const [connectionStatus, setConnectionStatus] = useState<string>('waiting');
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameStatus, setGameStatus] = useState<boolean>(false);
  const [currentPlayer, setCurrentPlayer] = useState<boolean>(false);
  const [isGameOverModalOpen, setIsGameOverModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (roomCode) {
      socket.emit('join_room', roomCode);

      socket.on('room_joined', (word: string, board: string[][]) => {
        setWord(word);
        setBoard(board);
        setCurrentAttempt(Array(5).fill(''));
      });

      socket.on('player_joined', () => {
        setConnectionStatus('connected');
      });

      socket.on('invalid_word', () => {
        setCurrentAttempt(Array(5).fill(''));
      });

      socket.on('not_your_turn', () => {
        setCurrentAttempt(Array(5).fill(''));
      });

      socket.on('your_turn', (isYourTurn) => {
        setCurrentPlayer(isYourTurn);
      });

      socket.on('player_left', () => {
        socket.emit('leave_room', roomCode);
        navigate('/player-left');
      });

      socket.on('room_full', () => {
        navigate('/full');
      });

      socket.on('room_not_found', () => {
        navigate('/not-found');
      });

      socket.on('update_board', (newBoard: string[][], newCurrentRow: number): void => {
        setBoard(newBoard);
        setCurrentRow(newCurrentRow);
      });

      socket.on('game_over', (gameStatus) => {
        setGameOver(true);
        setGameStatus(gameStatus);
        setIsGameOverModalOpen(true);
      });

      const handleUnload = (event: BeforeUnloadEvent) => {
        event.preventDefault();
        socket.emit('leave_room', roomCode);
      };
      window.addEventListener('beforeunload', handleUnload);

      return () => {
        socket.off('room_joined');
        socket.off('player_joined');
        socket.off('invalid_word');
        socket.off('not_your_turn');
        socket.off('your_turn');
        socket.off('game_over');
        socket.off('room_full');
        socket.off('room_not_found');
        window.removeEventListener('beforeunload', handleUnload);
      };
    }
  }, [roomCode, navigate]);

  useEffect(() => {
    setBoard((prevBoard) => {
      const newBoard = [...prevBoard];
      newBoard[currentRow] = [...currentAttempt];
      return newBoard;
    });
  }, [currentAttempt, currentRow]);

  const handleLeaveRoom = () => {
    socket.emit('leave_room', roomCode);
    navigate('/');
  };

  const toggleGameOverModal = () => {
    setIsGameOverModalOpen((prev) => !prev);
  };

  if (!roomCode) {
    return <div>Room code is required!</div>;
  }

  return (
    <div
      className={`flex flex-col h-screen bg-indigo-300 overflow-hidden ${
        connectionStatus === 'waiting' ? 'pb-48 sm:pb-0' : 'pt-0'
      }`}
    >
      <div className='flex-grow flex flex-col items-center justify-center p-4 sm:p-6'>
        <div className='relative bg-indigo-50 shadow-md rounded px-4 py-6 mb-4 w-full max-w-md'>
          {roomCode && connectionStatus === 'waiting' ? (
            <>
              <Waiting code={roomCode} />
              <button
                className='bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4 mx-auto block'
                onClick={handleLeaveRoom}
                title='Leave Room'
              >
                Leave Room
              </button>
            </>
          ) : (
            <>
              {!gameOver &&
                (currentPlayer ? (
                  <p className='text-black text-center font-bold text-xl bg-green-100 p-2 rounded-lg shadow-md mb-2'>
                    It's your turn!
                  </p>
                ) : (
                  <p className='text-black text-center font-bold text-xl bg-yellow-100 p-2 rounded-lg shadow-md mb-2'>
                    Waiting for the other player...
                  </p>
                ))}

              <GameBoard board={board} word={word} currentRow={currentRow} />
              <Keyboard
                socket={socket}
                roomCode={roomCode}
                currentAttempt={currentAttempt}
                setCurrentAttempt={setCurrentAttempt}
                currentRow={currentRow}
                setCurrentRow={setCurrentRow}
                board={board}
                disabled={gameOver}
                word={word}
              />
              {gameOver && (
                <GameOver
                  win={gameStatus}
                  board={board}
                  word={word}
                  onClose={() => setIsGameOverModalOpen(false)}
                  isOpen={isGameOverModalOpen}
                />
              )}
            </>
          )}
        </div>
      </div>
      {connectionStatus === 'connected' && (
        <div className='fixed top-2 right-2 flex flex-row-reverse sm:flex-col sm:items-end space-x-2 sm:space-x-0 sm:space-y-2'>
          <button
            className='bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
            onClick={handleLeaveRoom}
            title='Leave Room'
          >
            Leave Room
          </button>
          {gameOver && (
            <button
              className='bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center'
              onClick={toggleGameOverModal}
              title='Toggle Game Over Modal'
            >
              <IoMdMenu size={24} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default RoomPage;
