#!/bin/bash

cd client && npm run build &

cd server && npm run dev &

wait
