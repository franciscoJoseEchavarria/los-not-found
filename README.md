# Aztro ☀️

**Aztro** es una infraestructura de aplicación full-stack diseñada para ejecutarse en **Azure** utilizando **Terraform** y **Docker**, con soporte para:

- Despliegue automatizado
- Contenedores personalizados (frontend y backend)
- Pruebas locales con `docker-compose`
- Scripts Bash para desarrollo, CI/CD y mantenimiento

## 📁 Estructura del Proyecto

```plaintext
aztro/
├── infra/
│   ├── dev-scripts/        # Scripts Bash para despliegue, pruebas locales y CI/CD
│   └── terraform/          # Configuración de infraestructura con Terraform
├── docker-compose.yml      # Levantamiento local de frontend + backend
├── .gitignore
└── README.md
```

---


## 🚀 Despliegue Rápido

### 1. Configurar variables compartidas

Edita el archivo:

```bash
infra/dev-scripts/shared-vars.sh

export SUFFIX="12345"
export LOCATION="eastus"
```

---

### 2. Desplegar Infraestructura

```bash
cd infra/dev-scripts
./deploy-infra.sh
```
---

### 3. Publicar Imágenes en Docker Hub

```bash
./docker-hub.sh
```

---

### 4. Probar Localmente

```bash
./local.sh
```

---

## 🔄 Destruir Infraestructura

```bash
./destroy-infra.sh
```

---

## 🏗️ Infraestructura con Terraform (Avanzado)

Este proyecto usa **Terraform** para aprovisionar recursos en Azure:

- App Service Plan
- App Services (API y Web con contenedores Docker)
- PostgreSQL Flexible Server
- Configuración de variables de entorno (App Settings)

### 📁 Archivos clave

```plaintext
infra/terraform/
├── main.tf
├── variables.tf
├── terraform.tfvars      # Valores concretos de tu entorno
└── outputs.tf 
```

---

### ▶️ Comandos básicos

```bash
terraform init
terraform plan -var-file="terraform.tfvars"
terraform apply -var-file="terraform.tfvars"
terraform destroy -var-file="terraform.tfvars"
```

---

### 📤 Outputs esperados

Después del `apply`, deberías ver:

- `web_app_url`
- `api_app_url`
- `postgres_fqdn`
- `connection_string`

### 📦 Ejemplo de `terraform.tfvars`

```hcl
project_name       = "aztro"
location           = "eastus"
suffix             = "12345"
postgres_admin     = "aztroadmin"
postgres_password  = "SuperSecret123!"
jwt_secret         = "SomeBase64EncodedKey"
```

---

## 🛠 Requisitos

Asegúrate de tener instaladas las siguientes herramientas:

- [Docker](https://www.docker.com/)
- [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli)
- [Terraform](https://developer.hashicorp.com/terraform/downloads)
- Cuenta en [Azure](https://portal.azure.com/)
- Cuenta en [Docker Hub](https://hub.docker.com/)

## 🧼 Convenciones

- Scripts en `infra/dev-scripts/` usan los prefijos `*-infra.sh` (infraestructura) y `*-hub.sh` (contenedores).
- Las imágenes Docker deben alojarse como:
  - `japersa/aztro-web`
  - `japersa/aztro-api`
- Las variables de entorno se inyectan por:
  - App Settings en Azure
  - Argumentos al contenedor
  - Archivos `.env` locales (opcional)

## ✨ Autor

**Japersa** · [GitHub](https://github.com/japersa) · [Docker Hub](https://hub.docker.com/u/japersa)
