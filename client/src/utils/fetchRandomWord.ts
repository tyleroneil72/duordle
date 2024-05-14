const fetchRandomWord = async () => {
  try {
    const response = await fetch(`/api/word/random`);
    if (!response.ok) {
      const errorBody = await response.json(); // Attempt to read the response body as JSON
      throw new Error(errorBody.message || "Failed to fetch the word"); // Use server-provided message if available
    }
    const data = await response.json();
    return data.word.word;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching random word:", error.message);
      alert("Error fetching random word: " + error.message); // Display the error message from the server
    } else {
      console.error("An unknown error occurred:", error);
      alert("An unknown error occurred, please try again later.");
    }
    return null; // Return null in case of error
  }
};

export default fetchRandomWord;
