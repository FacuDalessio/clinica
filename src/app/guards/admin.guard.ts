import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { UsuarioService } from '../servicios/usuario/usuario.service';

export const adminGuard: CanActivateFn = async (route, state) => {

  const usuarioService = inject(UsuarioService);
  const user = usuarioService.getUserLogeado()?.email;
  let result = false;
  if (user) {
    try {
        const userObj: any = await usuarioService.getUserByMail(user);
        return !!userObj?.admin;
    } catch (err) {
        console.log(err);
        return false;
    }
  }

  return false;
};
