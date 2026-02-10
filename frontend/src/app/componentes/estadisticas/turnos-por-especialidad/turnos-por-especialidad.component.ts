import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Firestore, collection, onSnapshot } from '@angular/fire/firestore';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { QueryDocumentSnapshot, QuerySnapshot, query } from 'firebase/firestore';
import { utils, writeFileXLSX } from 'xlsx';
import { ClickAfueraDirective } from '../../../directivas/click-afuera.directive';

@Component({
  selector: 'app-turnos-por-especialidad',
  standalone: true,
  imports: [
    CommonModule,
    NgxChartsModule,
    ClickAfueraDirective
  ],
  templateUrl: './turnos-por-especialidad.component.html',
  styleUrl: './turnos-por-especialidad.component.css'
})
export class TurnosPorEspecialidadComponent implements OnInit{

  @Output() onVolver = new EventEmitter<any>();
  turnos: any[] = [];
  especialidades: any[] = [];
  contTurnos: any[] = [];
  datosGrafico: any[] = [];
  cont: number = 0;

  viewVBC: [number, number] = [800, 300];
  animationsVBC = false;
  legendVBC = true;
  xAxisVBC = true;
  yAxisVBC = true;
  showYAxisLabelVBC = true;
  yAxisLabelVBC = "Cantidad de turnos";


  constructor(
    private firestore: Firestore
  ){}

  ngOnInit(): void {
    const qEspecialidades = query(collection(this.firestore, "especialidades"));
      onSnapshot(qEspecialidades, (snapshot: QuerySnapshot) => {
        snapshot.forEach((doc: QueryDocumentSnapshot) => {
          this.especialidades.push(doc.data());
          this.contTurnos.push(0);
        });
    });
    const q = query(collection(this.firestore, "turnos"));
      onSnapshot(q, (snapshot: QuerySnapshot) => {
        snapshot.forEach((doc: QueryDocumentSnapshot) => {
          let turno: any = doc.data();
          this.especialidades.forEach((especialidad: any, index) =>{
            if (!turno.cancelado && turno.especialidad == especialidad.detalle) {
              this.contTurnos[index]++;
            }
          });
          this.generarDatosGrafico();
        });
    });
  }

  cerrarComponente(){
    if(this.cont > 0){
      this.onVolver.emit();
    }else{
      this.cont++;
    }
  }

  generarDatosGrafico(){
    this.datosGrafico = [];
    this.especialidades.forEach((especialidad: any, index) =>{
      this.datosGrafico.push({
        "name": especialidad.detalle,
        "value": this.contTurnos[index]
      });
    });
  }

  descargar(){
    const ws = utils.json_to_sheet(this.datosGrafico);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Data");
    writeFileXLSX(wb, "CantidadTurnosPorEspecialidad.xlsx");
  }
}
