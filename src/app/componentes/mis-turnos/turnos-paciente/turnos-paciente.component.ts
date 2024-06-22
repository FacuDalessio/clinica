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
  historiasMedicas: any[] = [];
  especialidadAux: string = '';
  especialistaElegido?: any;
  mostrarLista: boolean = false;
  ejecutandoAccion: boolean = false;
  accion?: string;
  motivoCancelamiento: string = '';
  encuestaComentario: string = '';
  turnoEnAccion?: any;
  calificacion?: number;
  buscar?: string;

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
        turno.id = doc.ref.id;
        turno.fecha = turno.fecha.toDate();
        turno.verResenia = false;
        this.turnos.push(turno);
      });
    });

    const qHistoriaMedicas = query(collection(this.firestore, "historiaMedica"));
      onSnapshot(qHistoriaMedicas, (snapshot: QuerySnapshot) => {
        snapshot.forEach((doc: QueryDocumentSnapshot) => {
          if (doc.data()['paciente'].mail == this.userService.usuarioLogeado.mail) {
            const historiaMedica: any = doc.data();
            historiaMedica.ref = doc.ref;
            historiaMedica.fecha = historiaMedica.fecha.toDate();
            this.historiasMedicas.push(historiaMedica);
          }
        });
    });
  }

  onChangeBuscar(){
    this.turnosAux = [];
    this.mostrarLista = true;
    if (this.buscar != '') {
      this.turnos.forEach((turno: any) =>{
        if (turno.especialista.apellido == this.buscar || turno.especialista.nombre == this.buscar || turno.fecha.getDate() == this.buscar || turno.fecha.getMonth() == this.buscar
              || turno.fecha.getFullYear() == this.buscar || turno.especialidad == this.buscar || turno.hora == this.buscar || (this.buscar == 'finalizado' && turno.finalizado)
              || (this.buscar == 'cancelado' && turno.cancelado)) {
          this.turnosAux.push(turno);
        }
      });
  
      this.historiasMedicas.forEach((historia: any) =>{
        if (historia.altura == this.buscar || historia.presion == this.buscar || historia.temperatura == this.buscar || historia.peso == this.buscar || historia.clave1 == this.buscar
          || historia.clave2 == this.buscar || historia.clave3 == this.buscar || historia.valor1 == this.buscar || historia.valor2 == this.buscar || historia.valor3 == this.buscar) {
          
          this.turnos.forEach((turno: any) =>{
            if (turno.id == historia.turno) {
              this.turnosAux.push(turno); 
            }
          });
        }
      });
    }
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

  ejecutarCalificacion(turno: any){
    this.calificacion = undefined;
    this.ejecutandoAccion = true;
    this.turnoEnAccion = turno;
    this.accion = 'calificacion';
  }

  guardarCalificacion(){
    Swal.fire({
      title: "¿Queres enviar la calificacion?",
      text: `Fecha del turno: ${this.turnoEnAccion.fecha.getDate()}/${this.turnoEnAccion.fecha.getMonth() + 1}/${this.turnoEnAccion.fecha.getFullYear()} ${this.turnoEnAccion.hora}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: 'No',
      confirmButtonText: "Si"
    }).then((result) => {
      if (result.isConfirmed) {
        this.turnoEnAccion.calificacion = this.calificacion;
        delete this.turnoEnAccion.verResenia;
        this.turnoService.updateTurno(this.turnoEnAccion, this.turnoEnAccion.ref)
        .then(response =>{
          Swal.fire({
            title: "Enviado!",
            text: "Se envio la calificacion con exito",
            icon: "success"
          });
          this.ejecutandoAccion = false;
        })
        .catch(err =>{
          Swal.fire({
            title: "Error!",
            text: "Se produjo un error al enviar la calificacion",
            icon: "error"
          });
        });
      }
    });
  }

  ejecutarEncuesta(turno: any){
    this.encuestaComentario = '';
    this.ejecutandoAccion = true;
    this.turnoEnAccion = turno;
    this.accion = 'encuesta';
  }

  guardarEncuesta(){
    Swal.fire({
      title: "¿Queres enviar la encuesta?",
      text: `Fecha del turno: ${this.turnoEnAccion.fecha.getDate()}/${this.turnoEnAccion.fecha.getMonth() + 1}/${this.turnoEnAccion.fecha.getFullYear()} ${this.turnoEnAccion.hora}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: 'No',
      confirmButtonText: "Si"
    }).then((result) => {
      if (result.isConfirmed) {
        this.turnoEnAccion.encuesta = this.encuestaComentario;
        delete this.turnoEnAccion.verResenia;
        this.turnoService.updateTurno(this.turnoEnAccion, this.turnoEnAccion.ref)
        .then(response =>{
          Swal.fire({
            title: "Enviado!",
            text: "Se envio la encuesta con exito",
            icon: "success"
          });
          this.ejecutandoAccion = false;
        })
        .catch(err =>{
          Swal.fire({
            title: "Error!",
            text: "Se produjo un error al enviar la encuesta",
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
        delete this.turnoEnAccion.verResenia;
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
