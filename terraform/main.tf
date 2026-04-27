resource "azurerm_resource_group" "rg" {
  name = "rg-gpacalc-test-eastus"
  location = "eastus"
}

resource "azurerm_log_analytics_workspace" "logs" {
  name = "law-gpacalc-test"
  location = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  sku = "PerGB2018"
  retention_in_days = 30
}

resource "azurerm_container_app_environment" "env" {
  name = "cae-gpacalc-test"
  location = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  log_analytics_workspace_id = azurerm_log_analytics_workspace.logs.id
}

resource "azurerm_container_app" "app" {
  name = "ca-gpacalc-test"
  container_app_environment_id = azurerm_container_app_environment.env.id
  resource_group_name = azurerm_resource_group.rg.name
  revision_mode = "Single"

  template {
    container {
      name = "gpa-app"
      image = "ghcr.io/karelise/gpa-app:latest"
      cpu = 0.25
      memory = "0.5Gi"
    }
  }

  ingress {
    external_enabled = false
    target_port = 80
    transport = "auto"

    traffic_weight {
      percentage = 100
      latest_revision = true
    }
  }
}