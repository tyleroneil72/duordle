#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Echo commands to the terminal output
set -x

# Change directory to client and build
echo "Building client..."
cd client
npm run build

# Go back to the root directory and then into the server directory
echo "Building server..."
cd ../server
npm run build

# Start the server
echo "Starting server in production mode..."
npm run start
