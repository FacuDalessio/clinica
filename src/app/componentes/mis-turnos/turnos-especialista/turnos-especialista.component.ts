import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../servicios/usuario/usuario.service';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { TurnoService } from '../../../servicios/turno/turno.service';
import Swal from 'sweetalert2';
import { QueryDocumentSnapshot, QuerySnapshot, query } from 'firebase/firestore';
import { Firestore, collection, onSnapshot, where } from '@angular/fire/firestore';

@Component({
  selector: 'app-turnos-especialista',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    FormsModule,
    MatRadioModule
  ],
  templateUrl: './turnos-especialista.component.html',
  styleUrl: './turnos-especialista.component.css'
})
export class TurnosEspecialistaComponent implements OnInit{

  onSpinner: boolean = true;
  pacientes: any[] = [];
  pacientesAux: any[] = [];
  especialidades: any[] = [];
  turnos: any[] = [];
  turnosAux: any[] = [];
  especialidadAux: string = '';
  pacienteElegido?: any;
  mostrarLista: boolean = false;
  ejecutandoAccion: boolean = false;
  motivoCancelamiento: string = '';
  resenia: string = '';
  turnoEnAccion?: any;
  accion?: string;

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

    const qTurnos = query(collection(this.firestore, "turnos"));
    onSnapshot(qTurnos, (snapshot: QuerySnapshot) => {
      snapshot.forEach((doc: QueryDocumentSnapshot) => {
        let turno: any = doc.data();
        turno.ref = doc.ref;
        turno.verResenia = false;
        if (turno.especialista.dni == this.userService.usuarioLogeado.dni)
          this.turnos.push(turno);
      });
    });
  }

  onChangeEspecialidad(){
    this.pacientesAux = [];
    this.pacienteElegido = undefined;
    this.turnosAux= [];
    this.mostrarLista = false;
    if (this.especialidadAux) {
      this.turnos.forEach((turno: any) => {
        if (turno.especialidad == this.especialidadAux) {
          if(!(turno.fecha instanceof Date))
            turno.fecha = turno.fecha.toDate();
          this.turnosAux.push(turno);
          let cont = 0;
          this.pacientesAux.forEach((paciente: any) =>{
            if(paciente.dni == turno.paciente.dni)
              cont++;
          });
            if(cont == 0)
              this.pacientesAux.push(turno.paciente);
        }
      })
      this.mostrarLista = true;
    }
  }

  onChangePaciente(){
    this.turnosAux = [];
    this.mostrarLista = true;
    if (this.pacienteElegido) {
      this.turnos.forEach((turno: any) =>{
        if (turno.especialidad == this.especialidadAux && turno.paciente.dni == this.pacienteElegido.dni) {
          if(!(turno.fecha instanceof Date))
            turno.fecha = turno.fecha.toDate();
          this.turnosAux.push(turno);
        }
      });
    }
  }

  async aceptarTurno(turno: any){
    turno.aceptado = true;
    await this.turnoService.updateTurno(turno, turno.ref);
  }

  async ejecutarFinalizar(turno: any){
    this.resenia = '';
    this.ejecutandoAccion = true;
    this.turnoEnAccion = turno;
    this.accion = 'finalizar';
  }

  finalizarTurno(){
    Swal.fire({
      title: "¿Queres finalizar el turno?",
      text: `Fecha: ${this.turnoEnAccion.fecha.getDate()}/${this.turnoEnAccion.fecha.getMonth() + 1}/${this.turnoEnAccion.fecha.getFullYear()} ${this.turnoEnAccion.hora}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: 'No',
      confirmButtonText: "Si"
    }).then((result) => {
      if (result.isConfirmed) {
        this.turnoEnAccion.finalizado = true;
        this.turnoEnAccion.resenia = this.resenia;
        delete this.turnoEnAccion.verResenia;
        this.turnoService.updateTurno(this.turnoEnAccion, this.turnoEnAccion.ref)
        .then(response =>{
          Swal.fire({
            title: "Finalizado!",
            text: "El turno finalizo con exito",
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

  ejecutarCancelar(turno: any){
    this.motivoCancelamiento = '';
    this.ejecutandoAccion = true;
    this.turnoEnAccion = turno;
    this.accion = 'cancelar';
  }

  cancelarTurno(){
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
        delete this.turnoEnAccion.verResenia;
        this.turnoService.updateTurno(this.turnoEnAccion, this.turnoEnAccion.ref)
        .then(response =>{
          Swal.fire({
            title: "Cancelado!",
            text: "El turno se cancelo con exito",
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
