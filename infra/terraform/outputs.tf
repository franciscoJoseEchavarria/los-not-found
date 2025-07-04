output "api_url" {
  value = "https://${azurerm_linux_web_app.api_app.default_hostname}"
}

output "web_url" {
  value = "https://${azurerm_linux_web_app.web_app.default_hostname}"
}

output "postgres_fqdn" {
  value = azurerm_postgresql_flexible_server.postgres.fqdn
}
