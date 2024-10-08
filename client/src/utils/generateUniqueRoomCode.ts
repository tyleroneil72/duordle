const generateUniqueRoomCode = async (): Promise<string> => {
  let roomCode = generateRoomCode();
  while (await checkRoomCodeExists(roomCode)) {
    roomCode = generateRoomCode();
  }
  return roomCode;
};

const generateRoomCode = (): string => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const charactersLength = characters.length;
  for (let i = 0; i < 4; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const checkRoomCodeExists = async (roomCode: string): Promise<boolean> => {
  try {
    const response = await fetch(`/api/room/exists/${roomCode}`);
    if (!response.ok) {
      throw new Error('Failed to fetch from API');
    }
    const data = await response.json();
    return data.exists;
  } catch (error) {
    console.error('Error checking if room code exists:', error);
    alert('Error checking if room code exists: ' + error);
    // Assume the room code exists to prevent possible duplicates if there's an error
    return true;
  }
};

export default generateUniqueRoomCode;
