#!/bin/bash

# Stop and remove previous containers, networks, and volumes
docker compose down --rmi all --volumes --remove-orphans

# Build and start the services in detached mode
docker compose up --build -d --force-recreate