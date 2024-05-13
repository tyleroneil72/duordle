#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Echo commands to the terminal output
set -x

# Change directory to client and build
cd client
npm run build

# Go back to the root directory and then into the server directory
cd ../server
npm run build

# Start the server
npm run start
