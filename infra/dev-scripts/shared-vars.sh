# shared-vars.sh

# Sufijo compartido para nombres de recursos
SUFFIX="alt-a"

# Ubicación común para los recursos
LOCATION="centralus"

# Docker images and user
API_IMAGE="aztro-api"
WEB_IMAGE="aztro-web"
DOCKERHUB_USER="japersa" # Change this to your Docker Hub username

APP_RG="aztro-rg-$SUFFIX"
API_APP_NAME="aztro-api-app-$SUFFIX"
WEB_APP_NAME="aztro-web-app-$SUFFIX"