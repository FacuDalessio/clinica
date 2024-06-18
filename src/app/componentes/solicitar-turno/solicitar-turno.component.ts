import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Firestore, collection, onSnapshot, where } from '@angular/fire/firestore';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { QueryDocumentSnapshot, QuerySnapshot, query } from 'firebase/firestore';
import { ElegirTurnoComponent } from './elegir-turno/elegir-turno.component';
import { TurnoService } from '../../servicios/turno/turno.service';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { UsuarioService } from '../../servicios/usuario/usuario.service';
import {MatRadioModule} from '@angular/material/radio';

@Component({
  selector: 'app-solicitar-turno',
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
    CommonModule,
    ElegirTurnoComponent,
    FormsModule,
    RouterOutlet,
    MatRadioModule
  ],
  templateUrl: './solicitar-turno.component.html',
  styleUrl: './solicitar-turno.component.css'
})
export class SolicitarTurnoComponent implements OnInit{

  onSpinner: boolean = true;
  especialidades: string[] = [];
  especialistas: any[] = [];
  especialistasAux: any[] = [];
  especialidadAux?: string;
  dias: Date[] = [];
  mostrarFechas: boolean = false;
  diaElegido?: Date;
  especialistaElegido?: any;
  pacienteElegido?: any;
  userIsAdmin: boolean = false;
  dniAbuscar: string = '';

  constructor(
    private firestore: Firestore,
    public turnoService: TurnoService,
    private userService: UsuarioService
  ){}

  ngOnInit(): void {
    if(this.userService.usuarioLogeado.user == 'admin'){
      this.userIsAdmin = true;
    }else{
      this.pacienteElegido = this.userService.usuarioLogeado
    }
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

  buscarPaciente(){
    if (this.dniAbuscar.length == 8) {
      const qEspecialistas = query(collection(this.firestore, "usuarios"), where("dni", "==", this.dniAbuscar));
      onSnapshot(qEspecialistas, (snapshot: QuerySnapshot) => {
        snapshot.forEach((doc: QueryDocumentSnapshot) => {
          this.pacienteElegido = doc.data();
        });
      });
    }
  }

  onChangeEspecialidad(){
    this.especialistasAux = [];
    this.diaElegido = undefined;
    if (this.especialistasAux) {
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
