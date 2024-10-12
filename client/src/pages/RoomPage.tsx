import { useCallback, useEffect, useState } from 'react';
import { IoMdMenu } from 'react-icons/io';
import { useNavigate, useParams } from 'react-router-dom';
import GameBoard from '../components/GameBoard';
import GameOver from '../components/GameOver';
import GameStatusMessage from '../components/GameStatusMessage';
import Keyboard from '../components/Keyboard';
import Waiting from '../components/Waiting';
import { socket } from '../services/socket';

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
  const [playAgainPressed, setPlayAgainPressed] = useState<boolean>(false);

  const startNewGame = useCallback((newWord: string) => {
    setBoard(
      Array(6)
        .fill(null)
        .map(() => Array(5).fill(''))
    );
    setCurrentAttempt(Array(5).fill(''));
    setCurrentRow(0);
    setGameOver(false);
    setIsGameOverModalOpen(false);
    setWord(newWord);
    setPlayAgainPressed(false);
  }, []);

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

      socket.on('update_board', (newBoard: string[][], newCurrentRow: number) => {
        setBoard(newBoard);
        setCurrentRow(newCurrentRow);
      });

      socket.on('game_over', (gameStatus) => {
        setGameOver(true);
        setGameStatus(gameStatus);
        setIsGameOverModalOpen(true);
      });

      socket.on('new_game_started', (newWord: string) => {
        startNewGame(newWord);
      });

      return () => {
        socket.off('room_joined');
        socket.off('player_joined');
        socket.off('invalid_word');
        socket.off('not_your_turn');
        socket.off('your_turn');
        socket.off('game_over');
        socket.off('room_full');
        socket.off('room_not_found');
        socket.off('opponent_ready');
        socket.off('new_game_started');
      };
    }
  }, [roomCode, navigate, playAgainPressed, startNewGame]);

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

  const handlePlayAgain = () => {
    setPlayAgainPressed(true);
    socket.emit('player_ready_for_rematch', roomCode);
  };

  if (!roomCode) {
    return <div>Room code is required!</div>;
  }

  return (
    <div
      className={`flex h-screen flex-col overflow-hidden bg-indigo-300 ${
        connectionStatus === 'waiting' ? 'pb-48 sm:pb-0' : 'pt-0'
      }`}
    >
      <div className='flex flex-grow flex-col items-center justify-center p-4 sm:p-6'>
        <div className='relative mb-4 w-full max-w-md rounded bg-indigo-50 px-4 py-6 shadow-md'>
          {roomCode && connectionStatus === 'waiting' ? (
            <>
              <Waiting code={roomCode} />
              <button
                className='focus:shadow-outline mx-auto mt-4 block rounded bg-indigo-500 px-4 py-2 font-bold text-white hover:bg-indigo-700 focus:outline-none'
                onClick={handleLeaveRoom}
                title='Leave Room'
              >
                Leave Room
              </button>
            </>
          ) : (
            <>
              <GameStatusMessage gameOver={gameOver} currentPlayer={currentPlayer} gameStatus={gameStatus} />
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
                  onPlayAgain={handlePlayAgain}
                  playAgainPressed={playAgainPressed}
                />
              )}
            </>
          )}
        </div>
      </div>
      {connectionStatus === 'connected' && (
        <div className='fixed right-2 top-2 flex flex-row-reverse space-x-2 sm:flex-col sm:items-end sm:space-x-0 sm:space-y-2'>
          <button
            className='focus:shadow-outline rounded bg-indigo-500 px-4 py-2 font-bold text-white hover:bg-indigo-700 focus:outline-none'
            onClick={handleLeaveRoom}
            title='Leave Room'
          >
            Leave Room
          </button>
          {gameOver && (
            <button
              className='focus:shadow-outline flex items-center justify-center rounded bg-indigo-500 px-4 py-2 font-bold text-white hover:bg-indigo-700 focus:outline-none'
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
