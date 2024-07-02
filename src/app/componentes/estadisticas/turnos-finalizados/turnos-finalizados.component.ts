import { CommonModule, JsonPipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Firestore, collection, onSnapshot } from '@angular/fire/firestore';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { QueryDocumentSnapshot, QuerySnapshot, query, where } from 'firebase/firestore';
import { utils, writeFileXLSX } from 'xlsx';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'app-turnos-finalizados',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,
    NgxChartsModule,
    MatFormFieldModule, 
    MatDatepickerModule, 
    FormsModule, 
    ReactiveFormsModule, 
    JsonPipe
  ],
  templateUrl: './turnos-finalizados.component.html',
  styleUrl: './turnos-finalizados.component.css'
})
export class TurnosFinalizadosComponent implements OnInit{
  @Output() onVolver = new EventEmitter<any>();

  turnos: any[] = [];
  contTurnos: any[] = [];
  datosGrafico: any[] = [];
  medicos: any[] = [];
  mostrarGrafico: boolean = false;
  fechas = new FormGroup({
    desde: new FormControl<Date | null>(null, [Validators.required]),
    hasta: new FormControl<Date | null>(null, [Validators.required]),
  });

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
    const qEspecialistas = query(collection(this.firestore, "usuarios"), where("user", "==", "especialista"));
      onSnapshot(qEspecialistas, (snapshot: QuerySnapshot) => {
        snapshot.forEach((doc: QueryDocumentSnapshot) => {
          this.medicos.push(doc.data());
          this.contTurnos.push(0);
        });
    });
    const q = query(collection(this.firestore, "turnos"));
      onSnapshot(q, (snapshot: QuerySnapshot) => {
        snapshot.forEach((doc: QueryDocumentSnapshot) => {
          const turno: any = doc.data();
          turno.fecha = turno.fecha.toDate();
          this.turnos.push(turno);
        });
    });
  }

  get desde(){
    return this.fechas.get('desde')!.value;
  }

  get hasta(){
    return this.fechas.get('hasta')!.value;
  }

  generarGrafico(){
    this.medicos.forEach((medico, index) =>{
      this.contTurnos[index] = 0;
    });
    this.turnos.forEach((turno: any) =>{
      this.medicos.forEach((medico: any, index) =>{
        if (!turno.cancelado && turno.finalizado && turno.especialista.dni == medico.dni && turno.fecha >= this.desde! && turno.fecha <= this.hasta!) {
          this.contTurnos[index]++;
        }
      });
    });
    this.generarDatosGrafico();
    this.mostrarGrafico = true;
  }

  generarDatosGrafico(){
    this.datosGrafico = [];
    this.medicos.forEach((medico: any, index) =>{
      this.datosGrafico.push({
        "name": `${medico.apellido}, ${medico.nombre}`,
        "value": this.contTurnos[index]
      });
    });
  }

  descargar(){
    const datosGuardar: any[] = [];
    this.datosGrafico.forEach((dato: any) =>{
      datosGuardar.push({
        nombre: dato.name,
        cantidadTurnos: dato.value,
        desde: `${this.desde?.getDate()}/${this.desde?.getMonth()}/${this.desde?.getFullYear()}`,
        hasta: `${this.hasta?.getDate()}/${this.hasta?.getMonth()}/${this.hasta?.getFullYear()}`
      });
    });
    const ws = utils.json_to_sheet(datosGuardar);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Data");
    writeFileXLSX(wb, "CantidadTurnosFinalizadosPorMedico.xlsx");
  }
}
