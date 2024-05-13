#!/bin/bash

# Exit if any command fails
set -e

# Enable job control
set -m

# Build the client
echo "Building client..."
cd client
npm run build
cd ..

# Start the server in development mode
echo "Starting server in development mode..."
cd server
npm run dev &
cd ..

# Wait for all background jobs to complete
wait
echo "Client built and server started."
