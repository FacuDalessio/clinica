import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { UsuarioService } from '../../servicios/usuario/usuario.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatIconModule,
    RouterLink,
    CommonModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor(
    public userService: UsuarioService
  ){}
}
