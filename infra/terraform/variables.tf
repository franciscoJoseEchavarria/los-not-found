variable "app_rg" {
  type        = string
  description = "Resource group name"
}

variable "location" {
  type        = string
  default     = "centralus"
}

variable "plan_name" {
  type        = string
  default     = "aztro-appservice-plan"
}

variable "api_app_name" {
  type = string
}

variable "web_app_name" {
  type = string
}

variable "postgres_user" {
  type = string
}

variable "postgres_password" {
  type      = string
  sensitive = true
}

variable "postgres_db" {
  type = string
}

variable "jwt_key" {
  type = string
}

variable "jwt_issuer" {
  type = string
}

variable "jwt_audience" {
  type = string
}
