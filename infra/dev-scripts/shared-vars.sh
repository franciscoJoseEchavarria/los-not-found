# shared-vars.sh

# Sufijo compartido para nombres de recursos
SUFFIX="los-not-found"

# Ubicación común para los recursos
LOCATION="centralus"

# Docker images and user
API_IMAGE="aztro-api"
WEB_IMAGE="aztro-web"
DOCKERHUB_USER="pachito"

# Change this to your Docker Hub username

APP_RG="aztro-rg-$SUFFIX"
API_APP_NAME="aztro-api-app-$SUFFIX"
WEB_APP_NAME="aztro-web-app-$SUFFIX"

PLAN_NAME="aztro-appservice-plan-$SUFFIX"

POSTGRES_SERVER="aztro-postgres-server-$SUFFIX"
POSTGRES_DB="aztrodb"
POSTGRES_USER="aztroadmin"
POSTGRES_PASSWORD="P@ssw0rd1234!"

JWT_KEY="bmV3S2V5VmFsdWVGb3JTZWN1cml0eQ=="
JWT_ISSUER="bmV3SXNzdWVy"
JWT_AUDIENCE="bmV3QXVkaWVuY2U="