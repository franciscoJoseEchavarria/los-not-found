#!/bin/bash

set -e

# --- Load shared environment variables ---
source ./shared-vars.sh

# Set up Buildx for multi-platform support
echo "🔧 Setting up Docker Buildx..."
docker buildx create --use --name aztro-builder || docker buildx use aztro-builder

# Log in to Docker Hub
echo "🔐 Logging in to Docker Hub..."
docker login || { echo "❌ Docker login failed"; exit 1; }

# Build and push API image
echo "🐳 Building and pushing API image..."
docker buildx build \
  --platform linux/amd64 \
  --push \
  -t $DOCKERHUB_USER/$API_IMAGE:latest \
  ./api || { echo "❌ Failed to build API image"; exit 1; }

# Build and push WEB image
echo "🌐 Building and pushing WEB image..."
docker buildx build \
  --platform linux/amd64 \
  --push \
  -t $DOCKERHUB_USER/$WEB_IMAGE:latest \
  ./web || { echo "❌ Failed to build WEB image"; exit 1; }

echo "✅ Deployment completed successfully with multi-platform images!"