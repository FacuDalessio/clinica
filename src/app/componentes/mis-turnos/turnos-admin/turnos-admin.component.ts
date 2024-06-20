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
  selector: 'app-turnos-admin',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    FormsModule,
    MatRadioModule
  ],
  templateUrl: './turnos-admin.component.html',
  styleUrl: './turnos-admin.component.css'
})
export class TurnosAdminComponent implements OnInit{

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
  encuestaComentario: string = '';
  turnoEnAccion?: any;
  calificacion?: number;

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

    const qTurnos = query(collection(this.firestore, "turnos"));
    onSnapshot(qTurnos, (snapshot: QuerySnapshot) => {
      snapshot.forEach((doc: QueryDocumentSnapshot) => {
        let turno: any = doc.data();
        turno.ref = doc.ref;
        turno.verResenia = false;
        this.turnos.push(turno);
      });
    });
  }

  onChangeEspecialidad(){
    this.especialistasAux = [];
    this.especialistaElegido = undefined;
    this.turnosAux = [];
    if (this.especialidadAux) {
      this.turnos.forEach((turno: any) => {
        if (turno.especialidad == this.especialidadAux) {
          if(!(turno.fecha instanceof Date))
            turno.fecha = turno.fecha.toDate();
          this.turnosAux.push(turno);
          
          this.especialistas.forEach((especialista: any) => {
            especialista.especialidad.forEach((especialidad: string) => {
              if(especialidad == this.especialidadAux){
                let cont = 0;
                this.especialistasAux.forEach((esp: any) =>{
                  if(esp.dni == turno.especialista.dni)
                    cont++;
                });
                  if(cont == 0)
                    this.especialistasAux.push(especialista);
              }
            })
          });
        }
      })
      this.mostrarLista = true;
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
