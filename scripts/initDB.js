#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const API_KEY = process.env.API_KEY || "EXAMPLE_API_KEY";
const API_URL = process.env.API_URL || "http://localhost:3000/api/word";
const WORDS_FILE = process.env.WORDS_FILE || "words.json";

async function main() {
  try {
    const filePath = path.resolve(__dirname, WORDS_FILE);
    const rawData = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(rawData);

    if (!data.words || !Array.isArray(data.words)) {
      console.error(`Error: JSON missing a "words" array at ${filePath}`);
      process.exit(1);
    }

    for (const entry of data.words) {
      const { word, difficulty } = entry;
      if (!word || !difficulty) {
        console.warn(`Skipping invalid entry: ${JSON.stringify(entry)}`);
        continue;
      }

      try {
        const resp = await fetch(API_URL, {
          method: "POST",
          headers: {
            "x-api-key": API_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ word, difficulty }),
        });

        if (resp.status === 201) {
          const json = await resp.json();
          console.log(`Created: ${json.word.word} (${json.word.difficulty})`);
        } else {
          const body = await resp.text();
          console.error(
            `Failed to create '${word}', status=${resp.status}, body=`,
            body
          );
        }
      } catch (error) {
        console.error(`Request error for word '${word}': ${error.message}`);
      }
    }

    console.log("Done populating words.");
    process.exit(0);
  } catch (err) {
    if (err.code === "ENOENT") {
      console.error(`File not found: ${WORDS_FILE} at ${__dirname}.`);
    } else {
      console.error("Unexpected error:", err.message);
    }
    process.exit(1);
  }
}

main();
