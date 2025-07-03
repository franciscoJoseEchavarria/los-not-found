#!/bin/bash

set -e

# --- Variables de Configuración ---
APP_RG="aztro-rg"
DB_RG="aztro-db-rg"
LOCATION="eastus"

PLAN_NAME="aztro-appservice-plan"
API_APP_NAME="aztro-api-app"
WEB_APP_NAME="aztro-web-app"

POSTGRES_SERVER="aztro-postgres-server-$RANDOM"
POSTGRES_DB="aztrodb"
POSTGRES_USER="aztroadmin"
POSTGRES_PASSWORD="P@ssw0rd1234!"

JWT_KEY="bmV3S2V5VmFsdWVGb3JTZWNucml0eQ=="
JWT_ISSUER="bmV3SXNzdWVy"
JWT_AUDIENCE="bmV3QXVkaWVuY2U="

# --- Creación de Grupos de Recursos ---
echo "📦 Creando grupos de recursos '$APP_RG' y '$DB_RG'..."
if ! az group create --name $APP_RG --location $LOCATION; then
  echo "❌ Error al crear el grupo de recursos '$APP_RG'."
  exit 1
fi
if ! az group create --name $DB_RG --location $LOCATION; then
  echo "❌ Error al crear el grupo de recursos '$DB_RG'."
  exit 1
fi
echo "✅ Grupos de recursos creados/verificados."

# --- Creación del Plan de App Service ---
echo "🛠️ Creando App Service Plan '$PLAN_NAME' en el grupo de recursos '$APP_RG'..."
if ! az appservice plan create \
  --name $PLAN_NAME \
  --resource-group $APP_RG \
  --sku B1 \
  --is-linux; then
  echo "❌ Error al crear el App Service Plan '$PLAN_NAME'."
  exit 1
fi

# --- Espera y verificación robusta del App Service Plan ---
echo "Esperando que el App Service Plan se aprovisione (hasta 6.5 minutos, con reintentos)..."
PLAN_READY=false
RETRY_COUNT=0
MAX_RETRIES=20
while [ "$PLAN_READY" = false ] && [ "$RETRY_COUNT" -lt "$MAX_RETRIES" ]; do
  if az appservice plan show --resource-group $APP_RG --name $PLAN_NAME &> /dev/null; then
    PLAN_READY=true
    echo "✅ App Service Plan aprovisionado y listo."
  else
    echo "App Service Plan aún no listo. Reintentando en 20 segundos... ($((RETRY_COUNT + 1))/$MAX_RETRIES)"
    sleep 20
    RETRY_COUNT=$((RETRY_COUNT + 1))
  fi
done

if [ "$PLAN_READY" = false ]; then
  echo "❌ Error: El App Service Plan no se aprovisionó a tiempo. Por favor, revisa el portal de Azure."
  exit 1
fi

# --- Despliegue de la Web App para la API ---
echo "🚀 Creando Web App para la API '$API_APP_NAME'..."
if ! az webapp create \
  --resource-group $APP_RG \
  --plan $PLAN_NAME \
  --name $API_APP_NAME; then
  echo "❌ Error al crear la Web App de la API '$API_APP_NAME'."
  exit 1
fi

echo "Esperando que la Web App de la API se aprovisione (10 segundos)..."
sleep 10

echo "🚀 Configurando la imagen de contenedor para la API Web App '$API_APP_NAME'..."
if ! az webapp config container set \
  --name $API_APP_NAME \
  --resource-group $APP_RG \
  --docker-custom-image-name japersa/api:latest \
  --enable-app-service-storage true; then
  echo "❌ Error al configurar el contenedor para la Web App de la API '$API_APP_NAME'."
  exit 1
fi
echo "✅ Web App de la API creada y configurada con contenedor."

# --- Despliegue de la Web App para el Frontend Web ---
echo "🚀 Creando Web App para el frontend web '$WEB_APP_NAME'..."
if ! az webapp create \
  --resource-group $APP_RG \
  --plan $PLAN_NAME \
  --name $WEB_APP_NAME; then
  echo "❌ Error al crear la Web App del frontend '$WEB_APP_NAME'."
  exit 1
fi

echo "Esperando que la Web App del frontend se aprovisione (10 segundos)..."
sleep 10

echo "🚀 Configurando la imagen de contenedor para la Web App del frontend '$WEB_APP_NAME'..."
if ! az webapp config container set \
  --name $WEB_APP_NAME \
  --resource-group $APP_RG \
  --docker-custom-image-name japersa/web:latest \
  --enable-app-service-storage true; then
  echo "❌ Error al configurar el contenedor para la Web App del frontend '$WEB_APP_NAME'."
  exit 1
fi
echo "✅ Web App del frontend creada y configurada con contenedor."

# --- Creación del Servidor PostgreSQL Flexible ---
echo "🐘 Creando servidor PostgreSQL Flexible Server '$POSTGRES_SERVER' en '$DB_RG'..."
if ! az postgres flexible-server create \
  --resource-group $DB_RG \
  --name $POSTGRES_SERVER \
  --location $LOCATION \
  --admin-user $POSTGRES_USER \
  --admin-password $POSTGRES_PASSWORD \
  --sku-name Standard_B1ms \
  --tier Burstable \
  --version 15 \
  --storage-size 32 \
  --public-access all; then
  echo "❌ Error al iniciar la creación del servidor PostgreSQL Flexible '$POSTGRES_SERVER'."
  exit 1
fi
echo "✅ Inicio de la creación del servidor PostgreSQL Flexible. Esto puede tardar varios minutos."

# --- Espera y verificación robusta del servidor PostgreSQL ---
echo "Esperando que el servidor PostgreSQL Flexible se aprovisione (hasta 5 minutos, con reintentos)..."
SERVER_READY=false
RETRY_COUNT=0
MAX_RETRIES=15
while [ "$SERVER_READY" = false ] && [ "$RETRY_COUNT" -lt "$MAX_RETRIES" ]; do
  if az postgres flexible-server show --resource-group $DB_RG --name $POSTGRES_SERVER &> /dev/null; then
    SERVER_READY=true
    echo "✅ Servidor PostgreSQL Flexible aprovisionado y listo."
  else
    echo "Servidor PostgreSQL aún no listo. Reintentando en 20 segundos... ($((RETRY_COUNT + 1))/$MAX_RETRIES)"
    sleep 20
    RETRY_COUNT=$((RETRY_COUNT + 1))
  fi
done

if [ "$SERVER_READY" = false ]; then
  echo "❌ Error: El servidor PostgreSQL Flexible no se aprovisionó a tiempo. Por favor, revisa el portal de Azure."
  exit 1
fi

# --- Creación de la Base de Datos PostgreSQL ---
echo "📁 Creando base de datos '$POSTGRES_DB' en el servidor Flexible '$POSTGRES_SERVER'..."
if ! az postgres flexible-server db create \
  --resource-group $DB_RG \
  --server-name $POSTGRES_SERVER \
  --database-name $POSTGRES_DB; then
  echo "❌ Error al crear la base de datos '$POSTGRES_DB'."
  exit 1
fi
echo "✅ Base de datos '$POSTGRES_DB' creada."

# --- Configuración de la Cadena de Conexión y Variables de Entorno ---
echo "🔐 Recuperando el nombre de host de PostgreSQL para la cadena de conexión..."
POSTGRES_HOST=$(az postgres flexible-server show \
  --resource-group $DB_RG \
  --name $POSTGRES_SERVER \
  --query "fullyQualifiedDomainName" -o tsv)

POSTGRES_CONNECTION_STRING="postgresql://$POSTGRES_USER:$POSTGRES_PASSWORD@$POSTGRES_HOST:5432/$POSTGRES_DB"
echo "✅ Cadena de conexión PostgreSQL obtenida."

echo "⚙️ Configurando App Settings para la API Web App '$API_APP_NAME'..."
if ! az webapp config appsettings set \
  --resource-group $APP_RG \
  --name $API_APP_NAME \
  --settings POSTGRES_CONNECTION_STRING="$POSTGRES_CONNECTION_STRING" \
             POSTGRES_USER="$POSTGRES_USER" \
             POSTGRES_PASSWORD="$POSTGRES_PASSWORD" \
             POSTGRES_DB="$POSTGRES_DB" \
             POSTGRES_HOST="$POSTGRES_HOST" \
             JWT__KEY="$JWT_KEY" \
             JWT__ISSUER="$JWT_ISSUER" \
             JWT__AUDIENCE="$JWT_AUDIENCE"; then
  echo "❌ Error al configurar los App Settings para la API Web App '$API_APP_NAME'."
  exit 1
fi
echo "✅ App Settings para la API Web App configurados."

echo "⚙️ Configurando App Settings para la Web App del frontend '$WEB_APP_NAME'..."
VITE_API_URL_AZURE="https://$API_APP_NAME.azurewebsites.net"
if ! az webapp config appsettings set \
  --resource-group $APP_RG \
  --name $WEB_APP_NAME \
  --settings VITE_API_URL="$VITE_API_URL_AZURE"; then
  echo "❌ Error al configurar los App Settings para la Web App del frontend '$WEB_APP_NAME'."
  exit 1
fi
echo "✅ App Settings para la Web App del frontend configurados."

# --- Finalización del Despliegue ---
echo "✅ Infraestructura desplegada correctamente."
echo "---------------------------------------------------"
echo "Detalles de la Aplicación:"
echo "URL de la API App: https://$API_APP_NAME.azurewebsites.net"
echo "URL de la Web App: https://$WEB_APP_NAME.azurewebsites.net"
echo "---------------------------------------------------"
echo "Detalles de la Base de Datos PostgreSQL:"
echo "Nombre del Servidor: $POSTGRES_SERVER"
echo "Nombre de la Base de Datos: $POSTGRES_DB"
echo "Usuario Administrador: $POSTGRES_USER"
echo "Cadena de Conexión (para la API): $POSTGRES_CONNECTION_STRING"
