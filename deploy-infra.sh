#!/bin/bash

set -e

# --- Load shared environment variables ---
source ./shared-vars.sh

# --- Define variables ---
APP_RG="aztro-rg-$SUFFIX"

PLAN_NAME="aztro-appservice-plan"
API_APP_NAME="aztro-api-app-$SUFFIX"
WEB_APP_NAME="aztro-web-app-$SUFFIX"

POSTGRES_SERVER="aztro-postgres-server-$RANDOM"
POSTGRES_DB="aztrodb"
POSTGRES_USER="aztroadmin"
POSTGRES_PASSWORD="P@ssw0rd1234!"

JWT_KEY="bmV3S2V5VmFsdWVGb3JTZWN1cml0eQ=="
JWT_ISSUER="bmV3SXNzdWVy"
JWT_AUDIENCE="bmV3QXVkaWVuY2U="

# --- Create resource groups ---
echo "📦 Creating resource groups..."
az group create --name $APP_RG --location $LOCATION || true

# --- Create PostgreSQL Flexible Server ---
echo "🐘 Creating PostgreSQL Flexible Server..."
az postgres flexible-server create \
  --resource-group $APP_RG \
  --name $POSTGRES_SERVER \
  --location $LOCATION \
  --admin-user $POSTGRES_USER \
  --admin-password $POSTGRES_PASSWORD \
  --sku-name Standard_B1ms \
  --tier Burstable \
  --version 15 \
  --storage-size 32 \
  --public-access all

# --- Create PostgreSQL database ---
echo "📁 Creating PostgreSQL database..."
az postgres flexible-server db create \
  --resource-group $APP_RG \
  --server-name $POSTGRES_SERVER \
  --database-name $POSTGRES_DB

# --- Get PostgreSQL hostname ---
POSTGRES_HOST=$(az postgres flexible-server show \
  --resource-group $APP_RG \
  --name $POSTGRES_SERVER \
  --query "fullyQualifiedDomainName" -o tsv)

# --- Format connection string ---
CONNECTION_STRING="Host=$POSTGRES_HOST;Port=5432;Username=$POSTGRES_USER;Password=$POSTGRES_PASSWORD;Database=$POSTGRES_DB"

# --- Create App Service plan ---
echo "🛠️ Creating App Service Plan..."
az appservice plan create \
  --name $PLAN_NAME \
  --resource-group $APP_RG \
  --sku B1 \
  --is-linux

# --- Create API Web App ---
echo "🚀 Creating Web App for API..."
az webapp create \
  --resource-group $APP_RG \
  --plan $PLAN_NAME \
  --name $API_APP_NAME \
  --runtime "DOTNETCORE:9.0"

echo "⚙️ Setting container for API..."
az webapp config container set \
  --name $API_APP_NAME \
  --resource-group $APP_RG \
  --container-image-name japersa/aztro-api:latest \
  --container-registry-url https://index.docker.io

echo "📝 Enabling logs for API..."
az webapp log config \
  --name $API_APP_NAME \
  --resource-group $APP_RG \
  --docker-container-logging filesystem

# tail logs in background
az webapp log tail \
  --name $API_APP_NAME \
  --resource-group $APP_RG &

echo "🔐 Setting app settings for API..."
az webapp config appsettings set \
  --resource-group $APP_RG \
  --name $API_APP_NAME \
  --settings ConnectionStrings__DefaultConnection="$CONNECTION_STRING" \
             JWT__KEY="$JWT_KEY" \
             JWT__ISSUER="$JWT_ISSUER" \
             JWT__AUDIENCE="$JWT_AUDIENCE"

# --- Create frontend Web App ---
echo "🚀 Creating Web App for frontend..."
az webapp create \
  --resource-group $APP_RG \
  --plan $PLAN_NAME \
  --name $WEB_APP_NAME \
  --runtime "NODE:20-lts"

echo "⚙️ Setting container for frontend..."
az webapp config container set \
  --name $WEB_APP_NAME \
  --resource-group $APP_RG \
  --container-image-name japersa/aztro-web:latest \
  --container-registry-url https://index.docker.io

echo "📝 Enabling logs for frontend..."
az webapp log config \
  --name $WEB_APP_NAME \
  --resource-group $APP_RG \
  --docker-container-logging filesystem

# tail logs in background
az webapp log tail \
  --name $WEB_APP_NAME \
  --resource-group $APP_RG &

# --- Set frontend environment variable ---
VITE_API_URL_AZURE="https://$API_APP_NAME.azurewebsites.net"
echo "🌐 Setting VITE_API_URL for frontend..."
az webapp config appsettings set \
  --resource-group $APP_RG \
  --name $WEB_APP_NAME \
  --settings VITE_API_URL="$VITE_API_URL_AZURE"

# --- Final output ---
echo "✅ Infrastructure deployed successfully!"
echo "---------------------------------------------------"
echo "🔗 API: https://$API_APP_NAME.azurewebsites.net"
echo "🔗 Web: https://$WEB_APP_NAME.azurewebsites.net"
echo "🐘 DB Host: $POSTGRES_HOST"
echo "📄 Connection string: $CONNECTION_STRING"
echo "---------------------------------------------------"
