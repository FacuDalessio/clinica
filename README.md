# Clinica

Es una pagina de una clinica, pueden acceder tanto pacientes como especialistas o los administradores. Cada tipo de usuario cuenta con pantallas unicas para sus necesidades.
Como paciente se puede solicitar turnos y gestionarlos.
Como especialista se puede gestionar las especialidades que atiende y los turnos.
Como admin se puede gestionar los especialistas y los turnos. Tambien ver datos de todos los usuarios.
La pagina se encuentra en el siguiente link: https://clinica-af1bb.web.app

## Home

Esta es la pantalla de bienvenida, donde se tiene acceso al login, a solicitar y ver los turnos.
Url: https://clinica-af1bb.web.app/home

## Login

En esta pantalla el usuario se puede logear, cuenta con accesos rapidos para pacientes (los 3 primeros), especialistas (los siguientes dos) y para admin (el ultimo).
Para poder logearse correctamente el usuario debe tener verificado el mail con el que se registro. Ademas, si sos especialistas debes tener la aprobacion del admin.
Tambien cuenta con un link al registro.
Url: https://clinica-af1bb.web.app/login

## Registro

En esta pantalla es donde los pacientes y especialistas se pueden registrar.
Todos los campos son requeridos.
Tiene dos imagenes arriba, donde se puede seleccionar si queres registrarte como paciente (Imagen de la izquierda) o especialista (Imagen de la derecha).

Registro paciente:
Tiene que ingresar los datos pedidos y marcar el captcha.
Tiene que ingresar dos imagenes.

Registro especialista:
Tiene que ingresar los datos pedidos y marcar el captcha.
Cuenta con una opcion en el select donde elige la especialidad, llamada "Agregar especialidad", donde puede agregar una especialidad que no se encuentra en las opciones.
Solo debe ingresar una imagen.

Url: https://clinica-af1bb.web.app/registro

## Usuarios

Para poder acceder a esta seccion se tiene que ser admin, se ingresa desde un boton que dice "Usuarios" en el navBar.
En esta pantalla el admin puede ver todos los usuarios registrados y puede habilitar o deshabilitar a un especialista.
Tambien cuenta con un link al registro de admin.

Url: https://clinica-af1bb.web.app/usuarios

## Registro admin

Solo pueden acceder admins.
En esta pantalla un admin puede registrar a otro. 
Todos los campos son requeridos.
Solo debe ingresar una imagen.

Url: https://clinica-af1bb.web.app/registroAdministrador

## Mi perfil

Pantalla donde el usuario puede ver sus datos.
Si el usuario es epecialista, esta pagina cuenta con un boton donde podra seleccionar sus horarios disponibles, ademas si solo cuenta con una especialidad, se le dara la opcion de agregar otra.

Url: https://clinica-af1bb.web.app/perfil

## Horarios

A esta seccion solo pueden entrar los especialistas.
En esta pantalla el especialista podra elegir sus horarios en los que quiera trabajar.
En la parte superior le aparece los dias de la semana, con las flechas podra ir moviendose de un dia a otro.
En el medio aparecen los horarios, si estan en verdes esta disponible, si esta enrojo no. Para cambiar la hora de estado, solo hace falta hacer click en ella.
En la parte inferior le apatece sus especialidades, al igual que con los dias, con las felchas podra ir cambiando de especialidad.

Url: https://clinica-af1bb.web.app/horarios

## Mis turnos

Mis turnos paciente:
Como paciente podras ver tus turnos y gestionarlos.
Cuenta con un filtro, primero selecciona la especialidad y despues al medico, y se mostraran los turnos correspondientes.
Se podra ver la fecha, el estado, el especialista y la especiaildad del turno.
Ademas, puede cancelar el turno, ver la reseña (una vez que el especialista la haya escrito), calificar y completar una encuesta cuando haya finalizado el turno.
Si se cancela el turno se tendra que dejar un comentario del porque.

Mis turnos especialista:
Como especialista podras ver tus turnos y gestionarlos.
Cuenta con un filtro, primero selecciona la especialidad y despues al paciente, y se mostraran los turnos correspondientes. No hace falta seleccionar paciente.
Se podra ver la fecha, el estado, el paciente y la especiaildad del turno.
Ademas, puede aceptar o rechazar el turno, finalizar el turno, cancelar el turno (una vez que ya fue aceptado), escribir la reseña (una vez que el turno fue finalizado).
Si se cancela o rechaza un turno se tendra que dejar un comentario del porque.

Mis turnos admin:

Como admin podras ver todos los turnos y gestionarlos.
Cuenta con un filtro, primero selecciona la especialidad y despues al medico, y se mostraran los turnos correspondientes.
Ademas, puede cancelar el turno.
Si se cancela el turno se tendra que dejar un comentario del porque.

Url: https://clinica-af1bb.web.app/misTurnos

## Solicitar turno:

Solo pueden ingresar los admin y pacientes.
En esta pantalla se pueden solicitar los turnos.
Se elige una especialidad y un especialista, despues un dia y una hora donde este disponible el especialista.

Solicitar como admin:
Se debe ingresar el dni del paciente al que se le solicita el turno.

Url: https://clinica-af1bb.web.app/solicitarTurno
