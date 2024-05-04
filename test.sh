#!/bin/bash

cd client && npm run dev &

cd server && npm run dev &

wait
