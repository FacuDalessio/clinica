import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { TurnoService } from '../../../servicios/turno/turno.service';
import { Firestore, collection, onSnapshot, where } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { QueryDocumentSnapshot, QuerySnapshot, addDoc, query } from 'firebase/firestore';
import { UsuarioService } from '../../../servicios/usuario/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-elegir-turno',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './elegir-turno.component.html',
  styleUrl: './elegir-turno.component.css'
})
export class ElegirTurnoComponent implements OnChanges, OnInit {

  @Input() dia?: Date;
  @Input() especialista?: any;
  @Input() paciente?: any;
  @Input() especialidad?: string;
  horarios: any[] = [];
  horarioAux?: any;
  turnos: any[] = [];

  constructor(
    private turnoService: TurnoService,
    private firestore: Firestore
  ){}

  ngOnInit(): void {
    const qhorarios = query(collection(this.firestore, "horarios"));
    onSnapshot(qhorarios, (snapshot: QuerySnapshot) => {
      snapshot.forEach((doc: QueryDocumentSnapshot) => {
        this.horarios.push(doc.data());
      });
    });
    const qTurnos = query(collection(this.firestore, "turnos"));
    onSnapshot(qTurnos, (snapshot: QuerySnapshot) => {
      snapshot.forEach((doc: QueryDocumentSnapshot) => {
        this.turnos.push(doc.data());
      });
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dia'] || changes['especialista'] || changes['especialidad']) {
      if (this.dia && this.especialista && this.especialidad) {
        this.horarios.forEach((horario: any) =>{
          if (horario.mail == this.especialista.mail && horario.dia == this.turnoService.obtenerNombreDia(this.dia!) && horario.especialidad == this.especialidad) {
            this.horarioAux = { ...horario };
          }
        });

        if (this.horarioAux)
          this.horarioAux = JSON.parse(JSON.stringify(this.horarioAux));

        this.turnos.forEach((turno: any) =>{
          let fechaAux = turno.fecha.toDate();
          if (fechaAux.getDate() == this.dia?.getDate() && fechaAux.getMonth() == this.dia?.getMonth() && 
                turno.especialista.mail == this.especialista.mail && turno.especialidad == this.especialidad) {
            for (const [i, hora] of this.horarioAux.hora.entries()) {
              if(hora == turno.hora){
                this.horarioAux.disponibilidad[i] = false;
              }
            }
          }
        });
      }
    }
  }

  async crearTurno(hora: string){
    Swal.fire({
      title: "¿Queres agendar el turno?",
      text: `Fecha: ${this.dia?.getDate()}/${this.dia!.getMonth() + 1}/${this.dia?.getFullYear()} ${hora}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: 'Cancelar',
      confirmButtonText: "Agendar"
    }).then((result) => {
      if (result.isConfirmed) {
        let col = collection(this.firestore, 'turnos');
        addDoc(col, {
          fecha: this.dia,
          hora: hora,
          especialista: this.especialista,
          especialidad: this.especialidad,
          paciente: this.paciente,
          resenia: '',
          calificacion: 0,
          encuesta: '',
          aceptado: false,
          finalizado: false
        }).then(response =>{
          Swal.fire({
            title: "Agendado!",
            text: "Su turno se agendo con exito",
            icon: "success"
          });
        })
        .catch(err =>{
          Swal.fire({
            title: "Error!",
            text: "Se produjo un error en agendar el turno",
            icon: "error"
          });
        });
      }
    });
    
  }
}
