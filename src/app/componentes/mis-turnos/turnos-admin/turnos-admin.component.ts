import { Component } from '@angular/core';
import { UsuarioService } from '../../../servicios/usuario/usuario.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-turnos-admin',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './turnos-admin.component.html',
  styleUrl: './turnos-admin.component.css'
})
export class TurnosAdminComponent {

  constructor(
    public userService: UsuarioService
  ){}
}
