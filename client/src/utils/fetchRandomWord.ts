const SERVERURL: string = "http://localhost:3000";

const fetchRandomWord = async () => {
  try {
    const response = await fetch(`${SERVERURL}/word/random`);
    if (!response.ok) {
      throw new Error("Failed to fetch the word");
    }
    const data = await response.json();
    return data.word.word;
  } catch (error) {
    console.error("Error fetching random word:", error);
    alert("Error fetching random word: " + error);
    return null; // Return null in case of error
  }
};

export default fetchRandomWord;
