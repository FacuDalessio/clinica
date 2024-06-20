import { Component, OnInit } from '@angular/core';
import { TurnoService } from '../../servicios/turno/turno.service';
import { Firestore, collection, getDocs, where } from '@angular/fire/firestore';
import { query } from 'firebase/firestore';
import { UsuarioService } from '../../servicios/usuario/usuario.service';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-horarios',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './horarios.component.html',
  styleUrl: './horarios.component.css'
})
export class HorariosComponent implements OnInit{

  dias: string[] = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
  indice: number = 0;
  horarios: any = [];
  horarioAux: any = null;
  onSpinner: boolean = true;
  especialidad: string[] = this.usuarioService.usuarioLogeado.especialidad;
  indiceEspecialidad: number = 0;

  constructor(
    private turnoService: TurnoService,
    private firestore: Firestore,
    private usuarioService: UsuarioService
  ){}

  async ngOnInit() {
    const collHoarios = collection(this.firestore, "horarios");
    const q = query(collHoarios, where("mail", "==", this.usuarioService.usuarioLogeado.mail));
    let horario: any;
    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach( doc => {
        horario = doc.data();
        horario.ref = doc.ref;
        this.horarios.push(horario);
      });
      if (this.horarios.length == 0) {
        await this.turnoService.generarHorariosSemana(this.usuarioService.usuarioLogeado, this.usuarioService.usuarioLogeado.especialidad[0]);
        if (this.usuarioService.usuarioLogeado.especialidad[1]) {
          await this.turnoService.generarHorariosSemana(this.usuarioService.usuarioLogeado, this.usuarioService.usuarioLogeado.especialidad[1]);
        }
      }
      const querySnapshot2 = await getDocs(q);
      querySnapshot2.forEach( doc => {
        horario = doc.data();
        horario.ref = doc.ref;
        this.horarios.push(horario);
      });
      this.filtrarHorarioPorEspecialidadDia();
      this.onSpinner = false;
    } catch (error) {
        console.error("Error al obtener usuario:", error);
    }
  }

  filtrarHorarioPorEspecialidadDia(){
    this.horarioAux = null;
    this.horarios.forEach((horario: any) =>{
      if(horario.especialidad == this.especialidad[this.indiceEspecialidad] && horario.dia == this.dias[this.indice])
        this.horarioAux = horario;
    });
  }

  async disponibleOcupado(i: number){
    this.horarioAux.disponibilidad[i] = !this.horarioAux.disponibilidad[i];
    const result = await this.turnoService.updateHorario(this.horarioAux, this.horarioAux.ref);
    if (result) {
      console.log('se actualizo el horario');
    }else{
      console.log('error en actualizar');
    }
  }

  restarDia(){
    if (this.indice != 0) {
      this.indice--;
      this.filtrarHorarioPorEspecialidadDia();
    }else{
      this.indice = this.dias.length - 1;
      this.filtrarHorarioPorEspecialidadDia();
    }
  }

  sumarDia(){
    if (this.indice < this.dias.length - 1) {
      this.indice++;
      this.filtrarHorarioPorEspecialidadDia();
    }else{
      this.indice = 0;
      this.filtrarHorarioPorEspecialidadDia();
    }
  }

  sumarEspecialidad(){
    if (this.indiceEspecialidad < this.especialidad.length - 1) {
      this.indiceEspecialidad++;
      this.filtrarHorarioPorEspecialidadDia();
    }else{
      this.restarEspecialidad();
      this.filtrarHorarioPorEspecialidadDia();
    }
  }

  restarEspecialidad(){
    if (this.indiceEspecialidad != 0) {
      this.indiceEspecialidad--;
      this.filtrarHorarioPorEspecialidadDia();
    }else{
      this.sumarEspecialidad();
      this.filtrarHorarioPorEspecialidadDia();
    }
  }
}

// await this.turnoService.generarHorariosSemana({
//   nombre: 'maria',
//   apellido: 'torsello',
//   mail: 'jr31eaoi@cj.mintemail.com'
// }, 'dermatologia');

// await this.turnoService.generarHorariosSemana({
//   nombre: 'nico',
//   apellido: 'ferro',
//   mail: '03ofjt9p@cj.mintemail.com'
// }, 'pediatria');

// await this.turnoService.generarHorariosSemana({
//   nombre: 'nico',
//   apellido: 'ferro',
//   mail: '03ofjt9p@cj.mintemail.com'
// }, 'cardiologia');
