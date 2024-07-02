import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { LogsIngresosComponent } from './logs-ingresos/logs-ingresos.component';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TurnosPorEspecialidadComponent } from '../turnos-por-especialidad/turnos-por-especialidad.component';

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [
    MatIconModule,
    LogsIngresosComponent,
    RouterOutlet,
    CommonModule,
    TurnosPorEspecialidadComponent
  ],
  templateUrl: './estadisticas.component.html',
  styleUrl: './estadisticas.component.css'
})
export class EstadisticasComponent {

  verLogs: boolean = false;
  verTurnosPorEspecialidad: boolean = false;
}
