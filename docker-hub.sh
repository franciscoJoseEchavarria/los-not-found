#!/bin/bash

# Este script automatiza el despliegue de una aplicación web de dos capas (API y Frontend)
# y una base de datos PostgreSQL en Azure App Service y Azure Database for PostgreSQL Flexible Server.

# Se detendrá inmediatamente si un comando falla.
set -e

# --- Variables de Configuración ---
# Grupos de recursos para organizar los recursos de Azure.
APP_RG="aztro-rg" # Grupo de recursos para la App Service Plan y las Web Apps
DB_RG="aztro-db-rg" # Grupo de recursos para la base de datos PostgreSQL
LOCATION="northeurope" # Región de Azure donde se desplegarán los recursos

# Nombres de los recursos de App Service
PLAN_NAME="aztro-appservice-plan" # Nombre del plan de App Service
API_APP_NAME="aztro-api-app" # Nombre de la Web App para la API
WEB_APP_NAME="aztro-web-app" # Nombre de la Web App para el frontend web

# Detalles del servidor PostgreSQL Flexible
# Se añade un sufijo aleatorio para asegurar un nombre de servidor único.
POSTGRES_SERVER="aztro-postgres-server-$RANDOM"
POSTGRES_DB="aztrodb" # Nombre de la base de datos
POSTGRES_USER="aztroadmin" # Usuario administrador de PostgreSQL
POSTGRES_PASSWORD="P@ssw0rd1234!" # IMPORTANTE: Utiliza una contraseña fuerte y única para entornos de producción.

# Configuración de JWT (JSON Web Token) para la API
# Estas variables se inyectarán como Application Settings en la Web App de la API.
JWT_KEY="bmV3S2V5VmFsdWVGb3JTZWN1cml0eQ=="
JWT_ISSUER="bmV3SXNzdWVy"
JWT_AUDIENCE="bmV3QXVkaWVuY2U="

# --- Creación de Grupos de Recursos ---
echo "📦 Creando grupos de recursos '$APP_RG' y '$DB_RG'..."
# Se usa '|| true' para que el script no falle si los grupos ya existen.
az group create --name $APP_RG --location $LOCATION || true
az group create --name $DB_RG --location $LOCATION || true
echo "✅ Grupos de recursos creados/verificados."

# --- Creación del Plan de App Service ---
echo "🛠️ Creando App Service Plan '$PLAN_NAME' en el grupo de recursos '$APP_RG'..."
# SKU B1 (Basic) es una opción económica y adecuada para cuentas de estudiante y desarrollo.
az appservice plan create \
  --name $PLAN_NAME \
  --resource-group $APP_RG \
  --sku B1 \
  --is-linux # Especifica que el plan es para contenedores Linux

echo "Esperando que el App Service Plan se aprovisione (45 segundos)..."
sleep 45 # Se da tiempo al plan para que se aprovisione completamente.
echo "✅ App Service Plan creado."

# --- Despliegue de la Web App para la API ---
echo "🚀 Creando Web App para la API '$API_APP_NAME'..."
# Primero se crea la Web App vacía.
az webapp create \
  --resource-group $APP_RG \
  --plan $PLAN_NAME \
  --name $API_APP_NAME

echo "Esperando que la Web App de la API se aprovisione (10 segundos)..."
sleep 10 # Se da tiempo al recurso de la Web App para que esté disponible.

echo "🚀 Configurando la imagen de contenedor para la API Web App '$API_APP_NAME'..."
# Luego se configura la imagen de Docker para la Web App de la API.
az webapp config container set \
  --name $API_APP_NAME \
  --resource-group $APP_RG \
  --docker-custom-image-name japersa/api:latest \
  --enable-app-service-storage true # Habilita el almacenamiento para logs/datos persistentes.
echo "✅ Web App de la API creada y configurada con contenedor."

# --- Despliegue de la Web App para el Frontend Web ---
echo "🚀 Creando Web App para el frontend web '$WEB_APP_NAME'..."
# Primero se crea la Web App vacía para el frontend.
az webapp create \
  --resource-group $APP_RG \
  --plan $PLAN_NAME \
  --name $WEB_APP_NAME

echo "Esperando que la Web App del frontend se aprovisione (10 segundos)..."
sleep 10 # Se da tiempo al recurso de la Web App para que esté disponible.

echo "🚀 Configurando la imagen de contenedor para la Web App del frontend '$WEB_APP_NAME'..."
# Luego se configura la imagen de Docker para la Web App del frontend.
az webapp config container set \
  --name $WEB_APP_NAME \
  --resource-group $APP_RG \
  --docker-custom-image-name japersa/web:latest \
  --enable-app-service-storage true
echo "✅ Web App del frontend creada y configurada con contenedor."

# --- Creación del Servidor PostgreSQL Flexible ---
echo "🐘 Creando servidor PostgreSQL Flexible Server '$POSTGRES_SERVER' en '$DB_RG'..."
# Se utiliza la capa Burstable (B1ms) que es rentable para desarrollo y estudio.
# 'public-network-access 0.0.0.0' permite el acceso público desde cualquier IP (equivalente a una regla de firewall).
az postgres flexible-server create \
  --resource-group $DB_RG \
  --name $POSTGRES_SERVER \
  --location $LOCATION \
  --admin-user $POSTGRES_USER \
  --admin-password $POSTGRES_PASSWORD \
  --sku-name Standard_B1ms \
  --tier Burstable \
  --version 16 \
  --storage-size 32 \
  --public-network-access 0.0.0.0 # Permite acceso público desde todas las IPs
echo "✅ Inicio de la creación del servidor PostgreSQL Flexible. Esto puede tardar varios minutos."

echo "Esperando que el servidor PostgreSQL Flexible se aprovisione (180 segundos o más)..."
sleep 180 # El aprovisionamiento de PostgreSQL Flexible Server puede tardar varios minutos.
echo "✅ Servidor PostgreSQL Flexible aprovisionado."

# --- Creación de la Base de Datos PostgreSQL ---
echo "📁 Creando base de datos '$POSTGRES_DB' en el servidor Flexible '$POSTGRES_SERVER'..."
az postgres flexible-server db create \
  --resource-group $DB_RG \
  --server-name $POSTGRES_SERVER \
  --database-name $POSTGRES_DB
echo "✅ Base de datos '$POSTGRES_DB' creada."

# --- Configuración de la Cadena de Conexión y Variables de Entorno ---
echo "🔐 Recuperando el nombre de host de PostgreSQL para la cadena de conexión..."
# Se obtiene el nombre de dominio completamente calificado (FQDN) del servidor PostgreSQL.
POSTGRES_HOST=$(az postgres flexible-server show \
  --resource-group $DB_RG \
  --name $POSTGRES_SERVER \
  --query "fullyQualifiedDomainName" -o tsv)

# Se construye la cadena de conexión de PostgreSQL.
# Formato: "postgresql://usuario:contraseña@host:puerto/base_de_datos"
POSTGRES_CONNECTION_STRING="postgresql://$POSTGRES_USER:$POSTGRES_PASSWORD@$POSTGRES_HOST:5432/$POSTGRES_DB"
echo "✅ Cadena de conexión PostgreSQL obtenida."

echo "⚙️ Configurando App Settings para la API Web App '$API_APP_NAME'..."
# Se establecen la cadena de conexión de la base de datos y la configuración de JWT
# como Application Settings para la Web App de la API.
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
echo "✅ App Settings para la API Web App configurados."

echo "⚙️ Configurando App Settings para la Web App del frontend '$WEB_APP_NAME'..."
# Se establece la VITE_API_URL como un Application Setting para la Web App del frontend.
# IMPORTANTE: En Azure App Service, VITE_API_URL debe apuntar a la URL de la API desplegada, no a localhost.
# Se establece a la URL esperada de la App de la API en Azure.
VITE_API_URL_AZURE="https://$API_APP_NAME.azurewebsites.net"
az webapp config appsettings set \
  --resource-group $APP_RG \
  --name $WEB_APP_NAME \
  --settings VITE_API_URL="$VITE_API_URL_AZURE"
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
echo "---------------------------------------------------"
