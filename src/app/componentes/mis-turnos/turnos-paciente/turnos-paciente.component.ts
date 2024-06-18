import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../servicios/usuario/usuario.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { QueryDocumentSnapshot, QuerySnapshot, query } from 'firebase/firestore';
import { Firestore, collection, onSnapshot, where } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { TurnoService } from '../../../servicios/turno/turno.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-turnos-paciente',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    FormsModule,
    MatRadioModule
  ],
  templateUrl: './turnos-paciente.component.html',
  styleUrl: './turnos-paciente.component.css'
})
export class TurnosPacienteComponent implements OnInit{

  onSpinner: boolean = true;
  especialistas: any[] = [];
  especialidades: any[] = [];
  turnos: any[] = [];
  turnosAux: any[] = [];
  especialistasAux: any[] = [];
  especialidadAux: string = '';
  especialistaElegido?: any;
  mostrarLista: boolean = false;
  ejecutandoAccion: boolean = false;
  accion?: string;
  motivoCancelamiento: string = '';
  turnoEnAccion?: any;

  constructor(
    public userService: UsuarioService,
    private firestore: Firestore,
    private turnoService: TurnoService
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

    const qTurnos = query(collection(this.firestore, "turnos"), where("paciente", "==", this.userService.usuarioLogeado));
    onSnapshot(qTurnos, (snapshot: QuerySnapshot) => {
      snapshot.forEach((doc: QueryDocumentSnapshot) => {
        let turno: any = doc.data();
        turno.ref = doc.ref;
        this.turnos.push(turno);
      });
    });
  }

  onChangeEspecialidad(){
    this.especialistasAux = [];
    this.mostrarLista = false;
    this.especialistaElegido = undefined;
    if (this.especialidadAux) {
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
    this.turnosAux = [];
    this.mostrarLista = true;
    if (this.especialistaElegido) {
      this.turnos.forEach((turno: any) =>{
        if (turno.especialidad == this.especialidadAux && turno.especialista.dni == this.especialistaElegido.dni) {
          if(!(turno.fecha instanceof Date))
            turno.fecha = turno.fecha.toDate();
          this.turnosAux.push(turno);
        }
      });
    }
  }

  ejecutarCancelar(turno: any){
    this.motivoCancelamiento = '';
    this.ejecutandoAccion = true;
    this.turnoEnAccion = turno;
    this.accion = 'cancelar';
  }

  async cancelarTurno(){
    Swal.fire({
      title: "¿Queres cancelar el turno?",
      text: `Fecha: ${this.turnoEnAccion.fecha.getDate()}/${this.turnoEnAccion.fecha.getMonth() + 1}/${this.turnoEnAccion.fecha.getFullYear()} ${this.turnoEnAccion.hora}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: 'No',
      confirmButtonText: "Si"
    }).then((result) => {
      if (result.isConfirmed) {
        this.turnoEnAccion.cancelado = true;
        this.turnoEnAccion.finalizado = true;
        this.turnoEnAccion.motivoCancelamiento = this.motivoCancelamiento;
        this.turnoService.updateTurno(this.turnoEnAccion, this.turnoEnAccion.ref)
        .then(response =>{
          Swal.fire({
            title: "Cancelado!",
            text: "Su turno se cancelo con exito",
            icon: "success"
          });
          this.ejecutandoAccion = false;
        })
        .catch(err =>{
          Swal.fire({
            title: "Error!",
            text: "Se produjo un error al cancelar el turno",
            icon: "error"
          });
        });
      }
    });
  }
}
