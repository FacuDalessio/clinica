import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../servicios/usuario/usuario.service';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { TurnoService } from '../../../servicios/turno/turno.service';
import Swal from 'sweetalert2';
import { QueryDocumentSnapshot, QuerySnapshot, query } from 'firebase/firestore';
import { Firestore, addDoc, collection, onSnapshot, where } from '@angular/fire/firestore';

@Component({
  selector: 'app-turnos-especialista',
  standalone: true,
  imports: [
    ReactiveFormsModule,
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
  historiasMedicas: any[] = [];
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
  buscar?: string;
  form: FormGroup = new FormGroup({
    'altura': new FormControl('', [Validators.required]),
    'peso': new FormControl('', [Validators.required]),
    'temperatura': new FormControl('', [Validators.required]),
    'presion': new FormControl('', [Validators.required]),
    'clave1': new FormControl(''),
    'clave2': new FormControl(''),
    'clave3': new FormControl(''),
    'valor3': new FormControl(''),
    'valor2': new FormControl(''),
    'valor1': new FormControl('')
  });

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
        turno.id = doc.ref.id;
        turno.fecha = turno.fecha.toDate();
        turno.verResenia = false;
        if (turno.especialista.dni == this.userService.usuarioLogeado.dni)
          this.turnos.push(turno);
      });
    });

    const qHistoriaMedicas = query(collection(this.firestore, "historiaMedica"));
      onSnapshot(qHistoriaMedicas, (snapshot: QuerySnapshot) => {
        snapshot.forEach((doc: QueryDocumentSnapshot) => {
          if (doc.data()['especialista'].mail == this.userService.usuarioLogeado.mail) {
            const historiaMedica: any = doc.data();
            historiaMedica.ref = doc.ref;
            historiaMedica.fecha = historiaMedica.fecha.toDate();
            this.historiasMedicas.push(historiaMedica);
          }
        });
    });
  }

  get altura() {
    return this.form.get('altura')?.value;
  }

  get peso() {
    return this.form.get('peso')?.value;
  }

  get temperatura() {
    return this.form.get('temperatura')?.value;
  }

  get presion() {
    return this.form.get('presion')?.value;
  }

  get clave1() {
    return this.form.get('clave1')?.value;
  }

  get clave2() {
    return this.form.get('clave2')?.value;
  }

  get clave3() {
    return this.form.get('clave3')?.value;
  }

  get valor1() {
    return this.form.get('valor1')?.value;
  }

  get valor2() {
    return this.form.get('valor2')?.value;
  }

  get valor3() {
    return this.form.get('valor3')?.value;
  }

  onChangeBuscar(){
    this.turnosAux = [];
    this.mostrarLista = true;
    this.especialidadAux = '';
    this.pacienteElegido = null;
    if (this.buscar != '') {
      this.turnos.forEach((turno: any) =>{
        if (turno.paciente.apellido == this.buscar || turno.paciente.nombre == this.buscar || turno.fecha.getDate() == this.buscar || turno.fecha.getMonth() == this.buscar
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

  alturaHasError() : string{
    if (this.altura?.dirty || this.altura?.touched) {
      if(this.altura?.hasError('required'))
        return 'La altura es requerida';
    }
    return '';
  }

  pesoHasError() : string{
    if (this.peso?.dirty || this.peso?.touched) {
      if(this.peso?.hasError('required'))
        return 'El peso es requerido';
    }
    return '';
  }

  temperaturaHasError() : string{
    if (this.temperatura?.dirty || this.temperatura?.touched) {
      if(this.temperatura?.hasError('required'))
        return 'La temperatura es requerida';
    }
    return '';
  }

  presionHasError() : string{
    if (this.presion?.dirty || this.presion?.touched) {
      if(this.presion?.hasError('required'))
        return 'La presion es requerida';
    }
    return '';
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
        this.onSpinner = true;
        this.turnoEnAccion.finalizado = true;
        this.turnoEnAccion.resenia = this.resenia;
        delete this.turnoEnAccion.verResenia;
        this.turnoService.updateTurno(this.turnoEnAccion, this.turnoEnAccion.ref)
        .then(response =>{
          let col = collection(this.firestore, 'historiaMedica');
          addDoc(col, {
              altura: this.altura,
              peso: this.peso,
              temperatura: this.temperatura,
              presion: this.presion,
              clave1: this.clave1,
              clave2: this.clave2,
              clave3: this.clave3,
              valor3: this.valor3,
              valor2: this.valor2,
              valor1: this.valor1,
              turno: this.turnoEnAccion.ref.id,
              paciente: this.turnoEnAccion.paciente,
              especialista: this.turnoEnAccion.especialista,
              fecha: this.turnoEnAccion.fecha
          })
          .then(response => {
            Swal.fire({
              title: "Finalizado!",
              text: "El turno finalizo con exito",
              icon: "success"
            });
            this.ejecutandoAccion = false;
            this.onSpinner = false;
          })
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
