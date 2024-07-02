import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collection, onSnapshot } from '@angular/fire/firestore';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { QueryDocumentSnapshot, QuerySnapshot, query } from 'firebase/firestore';
import { utils, writeFileXLSX } from 'xlsx';
import { TurnoService } from '../../../servicios/turno/turno.service';

@Component({
  selector: 'app-turnos-por-dia',
  standalone: true,
  imports: [
    CommonModule,
    NgxChartsModule
  ],
  templateUrl: './turnos-por-dia.component.html',
  styleUrl: './turnos-por-dia.component.css'
})
export class TurnosPorDiaComponent implements OnInit{

  @Output() onVolver = new EventEmitter<any>();
  turnos: any[] = [];
  dias: string[] = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
  contTurnos: any[] = [0, 0, 0, 0, 0, 0, 0];
  datosGrafico: any[] = [];

  viewVBC: [number, number] = [800, 300];
  animationsVBC = false;
  legendVBC = true;
  xAxisVBC = true;
  yAxisVBC = true;
  showYAxisLabelVBC = true;
  yAxisLabelVBC = "Cantidad de turnos";


  constructor(
    private firestore: Firestore,
    private turnoService: TurnoService
  ){}

  ngOnInit(): void {

    const q = query(collection(this.firestore, "turnos"));
      onSnapshot(q, (snapshot: QuerySnapshot) => {
        snapshot.forEach((doc: QueryDocumentSnapshot) => {
          const turno: any = doc.data();
          turno.fecha = turno.fecha.toDate();
          this.dias.forEach((dia: any, index) =>{
            if (!turno.cancelado && this.turnoService.obtenerNombreDia(turno.fecha) == dia) {
              this.contTurnos[index]++;
            }
          });
          this.generarDatosGrafico();
        });
    });
  }

  generarDatosGrafico(){
    this.datosGrafico = [];
    this.dias.forEach((dias: any, index) =>{
      this.datosGrafico.push({
        "name": dias,
        "value": this.contTurnos[index]
      });
    });
  }

  descargar(){
    const ws = utils.json_to_sheet(this.datosGrafico);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Data");
    writeFileXLSX(wb, "CantidadTurnosPorDia.xlsx");
  }
}
