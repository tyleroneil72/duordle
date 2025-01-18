# Duordle

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![ESLint](https://img.shields.io/badge/eslint-3A33D1?style=for-the-badge&logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/prettier-1A2C34?style=for-the-badge&logo=prettier&logoColor=F7BA3E)
![Jest](https://img.shields.io/badge/Jest-323330?style=for-the-badge&logo=Jest&logoColor=white)
![Render](https://img.shields.io/badge/Render-404D59?style=for-the-badge)

## Description

Duordle is an online game inspired by Wordle, designed to be a **multiplayer** word-guessing game where players can guess cooperatively. The project uses the **MERN** stack (MongoDB, Express.js, React, Node.js), along with:

- **TypeScript** on both client and server for type safety
- **Tailwind CSS** for utility-first styling
- **Socket.io** for real-time communication
- **Docker** for containerization
- **Jest** for unit testing
- Hosted on [Render](https://render.com/)

**Prettier** and **ESLint** are used to keep the code clean. Check out the live version at [duordle.net](https://duordle.net).

## High-Level Architecture

<img width="589" alt="Architecture Image" src="https://github.com/user-attachments/assets/14c14098-70e6-45d4-bf2c-22418d2bf2e6">

## Getting Started

Below are instructions for running the project **locally**, either **with Docker** (recommended) or **manually** (without Docker).

### 1. Running with Docker

1. **Ensure Docker & Docker Compose** are installed on your machine.
2. **Clone this repo**:

```bash
git clone https://github.com/tyleroneil72/duordle.git
cd duordle
```

3. **Build and run** with Docker Compose:

```bash
# If you prefer explicit build step:
docker compose build
docker compose up -d
# Or do it in one step:
docker compose up --build -d
```

Access the app at http://localhost:3000 (assuming 3000 is your `PORT`).

**Note:** If you have a `.env` file, Docker Compose can load it to override defaults. Otherwise, environment variables in `docker-compose.yml` are used.

### 2. Run manually (Without Docker)

#### Prerequisites

- Node.js (v18+ recommended)
- MongoDB (local or remote Atlas cluster)

#### Steps

**Clone** this repo:

```bash
git clone https://github.com/tyleroneil72/duordle.git
cd duordle
```

**Configure environment variables:** Create a `.env` file in the project root, or set them however you prefer. Example:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/Duordle
API_KEY=your_api_key_here
CLIENT_URL=http://localhost:3000
RATE_LIMIT=ON
```

**Note:** You will have to create and configure youre own MongoDB Database.

**Build** the application:

```bash
npm run build
```

**Start** the server:

```bash
npm run start
```

Access the app at http://localhost:3000 (assuming 3000 is your `PORT`).

### Populate the Database

To insert valid words into the database, run:

```bash
npm run init
```

**Note:** This will not work if Rate Limiter is turned on.

### Testing

To run the test suite, execute:

```bash
npm run test
```

## License

This project is licensed under the MIT License - see the `LICENSE` file for details.

## Acknowledgments

This project was inspired by Wordle, a game created by Josh Wardle and popularized by the New York Times. This game is an independent creation and is not affiliated with, sponsored by, or endorsed by the New York Times or the creators of Wordle.

## Contact

For any inquiries or questions, you can reach me at tyleroneildev@gmail.com
or on my linkedin at https://ca.linkedin.com/in/tyler-oneil-dev
