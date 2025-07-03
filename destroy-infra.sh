#!/bin/bash

# --- Variables de configuración ---
APP_RG="aztro-rg"
DB_RG="aztro-db-rg"

echo "🧨 Eliminando solo los grupos de recursos: $APP_RG y $DB_RG..."

# Eliminar APP_RG si existe
if az group show --name "$APP_RG" &>/dev/null; then
  echo "🗑️ Eliminando grupo: $APP_RG"
  az group delete --name "$APP_RG" --yes --no-wait
else
  echo "⚠️ Grupo $APP_RG no encontrado."
fi

# Eliminar DB_RG si existe
if az group show --name "$DB_RG" &>/dev/null; then
  echo "🗑️ Eliminando grupo: $DB_RG"
  az group delete --name "$DB_RG" --yes --no-wait
else
  echo "⚠️ Grupo $DB_RG no encontrado."
fi

echo "⏳ Eliminación iniciada. Esto puede tardar varios minutos."
