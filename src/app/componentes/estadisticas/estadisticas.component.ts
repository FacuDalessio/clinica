import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { LogsIngresosComponent } from './logs-ingresos/logs-ingresos.component';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TurnosPorEspecialidadComponent } from './turnos-por-especialidad/turnos-por-especialidad.component';
import { TurnosPorDiaComponent } from './turnos-por-dia/turnos-por-dia.component';

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [
    MatIconModule,
    LogsIngresosComponent,
    RouterOutlet,
    CommonModule,
    TurnosPorEspecialidadComponent,
    TurnosPorDiaComponent
  ],
  templateUrl: './estadisticas.component.html',
  styleUrl: './estadisticas.component.css'
})
export class EstadisticasComponent {

  verLogs: boolean = false;
  verTurnosPorEspecialidad: boolean = false;
  verTurnosPorDia: boolean = false;
}
