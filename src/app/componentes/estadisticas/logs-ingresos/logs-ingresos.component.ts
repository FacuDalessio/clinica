import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Firestore, collection, onSnapshot, orderBy } from '@angular/fire/firestore';
import { QueryDocumentSnapshot, QuerySnapshot, query } from 'firebase/firestore';
import { NombreApellidoPipe } from '../../../pipes/nombre-apellido.pipe';
import { HoraPipe } from '../../../pipes/hora.pipe';
import { utils, writeFileXLSX } from 'xlsx';
import { ClickAfueraDirective } from '../../../directivas/click-afuera.directive';

@Component({
  selector: 'app-logs-ingresos',
  standalone: true,
  imports: [
    CommonModule,
    NombreApellidoPipe,
    HoraPipe,
    ClickAfueraDirective
  ],
  templateUrl: './logs-ingresos.component.html',
  styleUrl: './logs-ingresos.component.css'
})
export class LogsIngresosComponent implements OnInit{

  @Output() onVolver = new EventEmitter<any>();
  logs: any[] = [];
  cont: number = 0;

  constructor(
    private firestore: Firestore
  ){}

  ngOnInit(): void {
    const q = query(collection(this.firestore, "logsIngresos"), orderBy('fecha', 'desc'));
      onSnapshot(q, (snapshot: QuerySnapshot) => {
        snapshot.forEach((doc: QueryDocumentSnapshot) => {
          const log: any = doc.data();
          log.fecha = log.fecha.toDate();
          this.logs.push(log);
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

  descargar(){
    const logsAux: any = [];
    this.logs.forEach((log: any) =>{
      logsAux.push({
        usuario: `${log.user.apellido}, ${log.user.nombre}`,
        mail: log.user.mail,
        dni: log.user.dni,
        fecha: `${log.fecha.getDate()}/${log.fecha.getMonth()}/${log.fecha.getFullYear()}`,
        hora: `${log.fecha.getHours()}:${log.fecha.getMinutes()} Hs`,
      });
    });
    const ws = utils.json_to_sheet(logsAux);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Data");
    writeFileXLSX(wb, "LogsIngresoUsuarios.xlsx");
  }
}
