#!/bin/bash

# --- Cargar variables compartidas ---
source ./shared-vars.sh

APP_RG="aztro-rg-$SUFFIX"

echo "🧨 Eliminando solo los grupos de recursos: $APP_RG."

# Eliminar APP_RG si existe
if az group show --name "$APP_RG" &>/dev/null; then
  echo "🗑️ Eliminando grupo: $APP_RG"
  az group delete --name "$APP_RG" --yes --no-wait
else
  echo "⚠️ Grupo $APP_RG no encontrado."
fi

echo "⏳ Eliminación iniciada. Esto puede tardar varios minutos."
