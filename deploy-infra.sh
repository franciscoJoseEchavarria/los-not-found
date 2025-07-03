#!/bin/bash

set -e

# --- Variables de Configuración ---
APP_RG="aztro-rg"
DB_RG="aztro-db-rg"
LOCATION="centralus"

PLAN_NAME="aztro-appservice-plan"
API_APP_NAME="aztro-api-app"
WEB_APP_NAME="aztro-web-app"

POSTGRES_SERVER="aztro-postgres-server-$RANDOM"
POSTGRES_DB="aztrodb"
POSTGRES_USER="aztroadmin"
POSTGRES_PASSWORD="P@ssw0rd1234!"

JWT_KEY="bmV3S2V5VmFsdWVGb3JTZWN1cml0eQ=="
JWT_ISSUER="bmV3SXNzdWVy"
JWT_AUDIENCE="bmV3QXVkaWVuY2U="

# --- Crear Grupos de Recursos ---
echo "📦 Creando grupos de recursos..."
az group create --name $APP_RG --location $LOCATION || true
az group create --name $DB_RG --location $LOCATION || true

# --- Crear App Service Plan ---
echo "🛠️ Creando App Service Plan..."
az appservice plan create \
  --name $PLAN_NAME \
  --resource-group $APP_RG \
  --sku B1 \
  --is-linux

# --- Crear Web App para la API ---
echo "🚀 Creando Web App para la API..."
az webapp create \
  --resource-group $APP_RG \
  --plan $PLAN_NAME \
  --name $API_APP_NAME \
  --runtime "DOTNETCORE:9.0"

# --- Configurar contenedor para la API ---
echo "⚙️ Configurando contenedor para la API..."
az webapp config container set \
  --name $API_APP_NAME \
  --resource-group $APP_RG \
  --docker-custom-image-name japersa/api:latest \
  --docker-registry-server-url https://index.docker.io

# --- Crear Web App para el Frontend ---
echo "🚀 Creando Web App para el Frontend..."
az webapp create \
  --resource-group $APP_RG \
  --plan $PLAN_NAME \
  --name $WEB_APP_NAME \
  --runtime "NODE:20-lts"

# --- Configurar contenedor para el Frontend ---
echo "⚙️ Configurando contenedor para el Frontend..."
az webapp config container set \
  --name $WEB_APP_NAME \
  --resource-group $APP_RG \
  --docker-custom-image-name japersa/web:latest \
  --docker-registry-server-url https://index.docker.io

# --- Crear servidor PostgreSQL Flexible ---
echo "🐘 Creando servidor PostgreSQL Flexible..."
az postgres flexible-server create \
  --resource-group $DB_RG \
  --name $POSTGRES_SERVER \
  --location $LOCATION \
  --admin-user $POSTGRES_USER \
  --admin-password $POSTGRES_PASSWORD \
  --sku-name Standard_B1ms \
  --tier Burstable \
  --version 15 \
  --storage-size 32 \
  --public-access all

# --- Crear base de datos ---
echo "📁 Creando base de datos PostgreSQL..."
az postgres flexible-server db create \
  --resource-group $DB_RG \
  --server-name $POSTGRES_SERVER \
  --database-name $POSTGRES_DB

# --- Obtener hostname del servidor PostgreSQL ---
POSTGRES_HOST=$(az postgres flexible-server show \
  --resource-group $DB_RG \
  --name $POSTGRES_SERVER \
  --query "fullyQualifiedDomainName" -o tsv)

POSTGRES_CONNECTION_STRING="postgresql://$POSTGRES_USER:$POSTGRES_PASSWORD@$POSTGRES_HOST:5432/$POSTGRES_DB"

# --- Configurar App Settings para la API ---
echo "🔐 Configurando variables de entorno para la API..."
az webapp config appsettings set \
  --resource-group $APP_RG \
  --name $API_APP_NAME \
  --settings POSTGRES_CONNECTION_STRING="$POSTGRES_CONNECTION_STRING" \
             POSTGRES_USER="$POSTGRES_USER" \
             POSTGRES_PASSWORD="$POSTGRES_PASSWORD" \
             POSTGRES_DB="$POSTGRES_DB" \
             POSTGRES_HOST="$POSTGRES_HOST" \
             JWT__KEY="$JWT_KEY" \
             JWT__ISSUER="$JWT_ISSUER" \
             JWT__AUDIENCE="$JWT_AUDIENCE"

# --- Configurar App Settings para el Frontend ---
echo "🌐 Configurando variable VITE_API_URL para el frontend..."
VITE_API_URL_AZURE="https://$API_APP_NAME.azurewebsites.net"
az webapp config appsettings set \
  --resource-group $APP_RG \
  --name $WEB_APP_NAME \
  --settings VITE_API_URL="$VITE_API_URL_AZURE"

# --- Finalización ---
echo "✅ Infraestructura desplegada correctamente."
echo "---------------------------------------------------"
echo "🔗 API: https://$API_APP_NAME.azurewebsites.net"
echo "🔗 Web: https://$WEB_APP_NAME.azurewebsites.net"
echo "🐘 DB Host: $POSTGRES_HOST"
echo "📄 Cadena de conexión: $POSTGRES_CONNECTION_STRING"
echo "---------------------------------------------------"
