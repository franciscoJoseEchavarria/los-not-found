terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.79"
    }
  }

  required_version = ">= 1.4.0"
}

provider "azurerm" {
  features {}
}

resource "random_integer" "unique" {
  min = 10000
  max = 99999
}

resource "azurerm_resource_group" "app" {
  name     = var.app_rg
  location = var.location
}

resource "azurerm_postgresql_flexible_server" "postgres" {
  name                   = "aztro-postgres-server-${random_integer.unique.result}"
  location               = azurerm_resource_group.app.location
  resource_group_name    = azurerm_resource_group.app.name
  administrator_login    = var.postgres_user
  administrator_password = var.postgres_password
  version                = "15"
  storage_mb             = 32768
  zone                   = "1"

  authentication {
    password_auth_enabled = true
  }

  public_network_access_enabled = true
  sku_name                      = "B_Standard_B1ms"
}

resource "azurerm_postgresql_flexible_server_firewall_rule" "allow_all" {
  name             = "allow_all"
  server_id        = azurerm_postgresql_flexible_server.postgres.id
  start_ip_address = "0.0.0.0"
  end_ip_address   = "255.255.255.255"
}

resource "azurerm_postgresql_flexible_server_database" "aztrodb" {
  name      = var.postgres_db
  server_id = azurerm_postgresql_flexible_server.postgres.id
  charset   = "UTF8"
  collation = "en_US.utf8"
}

resource "azurerm_service_plan" "plan" {
  name                = var.plan_name
  location            = azurerm_resource_group.app.location
  resource_group_name = azurerm_resource_group.app.name
  os_type             = "Linux"
  sku_name            = "B1"
}

resource "azurerm_linux_web_app" "api_app" {
  name                = var.api_app_name
  location            = azurerm_resource_group.app.location
  resource_group_name = azurerm_resource_group.app.name
  service_plan_id     = azurerm_service_plan.plan.id

  site_config {
    always_on = true
    application_stack {
      docker_image     = "japersa/aztro-api"
      docker_image_tag = "latest"
    }
  }

  app_settings = {
    "ConnectionStrings__DefaultConnection" = "Host=${azurerm_postgresql_flexible_server.postgres.fqdn};Port=5432;Username=${var.postgres_user};Password=${var.postgres_password};Database=${var.postgres_db}"
    "JWT__KEY"                             = var.jwt_key
    "JWT__ISSUER"                          = var.jwt_issuer
    "JWT__AUDIENCE"                        = var.jwt_audience
    "WEBSITES_ENABLE_APP_SERVICE_STORAGE"  = "false"
  }
}

resource "azurerm_linux_web_app" "web_app" {
  name                = var.web_app_name
  location            = azurerm_resource_group.app.location
  resource_group_name = azurerm_resource_group.app.name
  service_plan_id     = azurerm_service_plan.plan.id

  site_config {
    always_on = true
    application_stack {
      docker_image     = "japersa/aztro-web"
      docker_image_tag = "latest"
    }
  }

  app_settings = {
    "VITE_API_URL"                         = "https://${azurerm_linux_web_app.api_app.default_hostname}"
    "WEBSITES_ENABLE_APP_SERVICE_STORAGE" = "false"
  }
}

resource "null_resource" "enable_api_logs" {
  provisioner "local-exec" {
    command = <<EOT
      az webapp log config \
        --name ${azurerm_linux_web_app.api_app.name} \
        --resource-group ${azurerm_resource_group.app.name} \
        --docker-container-logging filesystem
    EOT
  }

  depends_on = [azurerm_linux_web_app.api_app]
}

resource "null_resource" "enable_web_logs" {
  provisioner "local-exec" {
    command = <<EOT
      az webapp log config \
        --name ${azurerm_linux_web_app.web_app.name} \
        --resource-group ${azurerm_resource_group.app.name} \
        --docker-container-logging filesystem
    EOT
  }

  depends_on = [azurerm_linux_web_app.web_app]
}
