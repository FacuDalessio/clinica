import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from './componentes/nav-bar/nav-bar.component';
import { FooterComponent } from './componentes/footer/footer.component';
import { UsuarioService } from './servicios/usuario/usuario.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavBarComponent,
    FooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'clinica';

  constructor(
    private usuarioService: UsuarioService
  ){}

  // @HostListener('window:beforeunload', ['$event'])
  // beforeunloadHandler(event: any) {
  //   this.usuarioService.logOut();
  // }
}
