import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { UsuarioService } from '../servicios/usuario/usuario.service';

export const especialistaGuard: CanActivateFn = (route, state) => {
  const usuarioService = inject(UsuarioService);
  return usuarioService.usuarioLogeado.user == 'especialista';
};
