import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Firestore, collection, onSnapshot, where } from '@angular/fire/firestore';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { QueryDocumentSnapshot, QuerySnapshot, query } from 'firebase/firestore';
import { ElegirTurnoComponent } from './elegir-turno/elegir-turno.component';
import { TurnoService } from '../../servicios/turno/turno.service';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-solicitar-turno',
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
    CommonModule,
    ElegirTurnoComponent,
    FormsModule,
    RouterOutlet
  ],
  templateUrl: './solicitar-turno.component.html',
  styleUrl: './solicitar-turno.component.css'
})
export class SolicitarTurnoComponent implements OnInit{

  onSpinner: boolean = true;
  especialidades: string[] = [];
  especialistas: any[] = [];
  especialistasAux: any[] = [];
  especialidadAux: string = '';
  dias: Date[] = [];
  mostrarFechas: boolean = false;
  diaElegido?: Date;
  especialistaElegido?: any;

  constructor(
    private firestore: Firestore,
    public turnoService: TurnoService
  ){}

  ngOnInit(): void {
    const qEspecialidades = query(collection(this.firestore, "especialidades"));
    onSnapshot(qEspecialidades, (snapshot: QuerySnapshot) => {
      snapshot.forEach((doc: QueryDocumentSnapshot) => {
        this.especialidades.push(doc.data()['detalle']);
      });
      this.onSpinner = false;
    });

    const qEspecialistas = query(collection(this.firestore, "usuarios"), where("user", "==", "especialista"));
    onSnapshot(qEspecialistas, (snapshot: QuerySnapshot) => {
      snapshot.forEach((doc: QueryDocumentSnapshot) => {
        this.especialistas.push(doc.data());
      });
    });

    const fechaActual = new Date();
    if(this.turnoService.obtenerNombreDia(fechaActual) != 'Domingo')
      this.dias.push(new Date(fechaActual));
    for (let i = 1; i < 16; i++) {
      let dateAux = new Date();
      dateAux.setDate(fechaActual.getDate() + i);
      if(this.turnoService.obtenerNombreDia(dateAux) != 'Domingo')
        this.dias.push(dateAux);
    }
  }

  onChangeEspecialidad($event: any){
    this.especialistasAux = [];
    this.diaElegido = undefined;
    this.especialidadAux = '';
    if ($event.target.value) {
      this.especialidadAux = $event.target.value;
      this.especialistas.forEach((especialista: any) => {
        especialista.especialidad.forEach((especialidad: string) => {
          if(especialidad == this.especialidadAux){
            this.especialistasAux.push(especialista);
          }
        })
      })
    }
  }

  onChangeEspecialista() {
    this.mostrarFechas = false;
    this.diaElegido = undefined;
    if (this.especialistaElegido) {
      this.mostrarFechas = true;
    }
  }
}
