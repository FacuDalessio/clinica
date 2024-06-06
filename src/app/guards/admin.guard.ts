import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { UsuarioService } from '../servicios/usuario/usuario.service';

export const adminGuard: CanActivateFn = async (route, state) => {

  const usuarioService = inject(UsuarioService);
  return usuarioService.isAdmin();
};
