import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UsuarioService } from '../../servicios/usuario/usuario.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule
  ],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {

  constructor(
    public usarioService: UsuarioService
  ){}
}
