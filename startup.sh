#!/bin/bash

echo "Build script"

npm install
npm install --prefix backend
npm install --prefix frontend
npm run build --prefix frontend
