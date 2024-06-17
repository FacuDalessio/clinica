import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { UsuarioService } from '../servicios/usuario/usuario.service';

export const solicitarTurnoGuard: CanActivateFn = (route, state) => {
  const usuarioService = inject(UsuarioService);
  return usuarioService.usuarioLogeado.user == 'paciente' || usuarioService.usuarioLogeado.user == 'admin';
};
