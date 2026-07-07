@login @smoke @regression @desktop
Feature: Login de usuario

  Como usuario registrado
  Quiero iniciar sesion en la aplicacion
  Para poder acceder al sistema

  @critical
  Scenario: Login exitoso con credenciales validas
    Given que el usuario se encuentra en la pantalla de login
    When ingresa usuario "standard_user"
    And ingresa contrasena "secret_sauce"
    And presiona el boton iniciar sesion
    Then deberia visualizar el dashboard principal
