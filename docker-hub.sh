#!/bin/bash

# Variables
API_IMAGE="aztro-api"
WEB_IMAGE="aztro-web"
DOCKERHUB_USER="japersa" # Change this to your Docker Hub username

# Build API image
echo "Building image for API..."
docker build -t $DOCKERHUB_USER/$API_IMAGE:latest ./api

# Build WEB image
echo "Building image for WEB..."
docker build -t $DOCKERHUB_USER/$WEB_IMAGE:latest ./web

# Login to Docker Hub
echo "Logging in to Docker Hub..."
docker login

# Push API image
echo "Pushing API image to Docker Hub..."
docker push $DOCKERHUB_USER/$API_IMAGE:latest

# Push WEB image
echo "Pushing WEB image to Docker Hub..."
docker push $DOCKERHUB_USER/$WEB_IMAGE:latest

echo "Deployment completed!"