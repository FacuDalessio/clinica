import { Component } from '@angular/core';
import { TurnosAdminComponent } from './turnos-admin/turnos-admin.component';
import { TurnosEspecialistaComponent } from './turnos-especialista/turnos-especialista.component';
import { TurnosPacienteComponent } from './turnos-paciente/turnos-paciente.component';

@Component({
  selector: 'app-mis-turnos',
  standalone: true,
  imports: [
    TurnosAdminComponent,
    TurnosEspecialistaComponent,
    TurnosPacienteComponent
  ],
  templateUrl: './mis-turnos.component.html',
  styleUrl: './mis-turnos.component.css'
})
export class MisTurnosComponent {

}
