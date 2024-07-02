import { Component, OnInit } from '@angular/core';
import { TurnoService } from '../../servicios/turno/turno.service';
import { Firestore, collection, getDocs, where } from '@angular/fire/firestore';
import { query } from 'firebase/firestore';
import { UsuarioService } from '../../servicios/usuario/usuario.service';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { routes } from '../../app.routes';

@Component({
  selector: 'app-horarios',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    FormsModule
  ],
  templateUrl: './horarios.component.html',
  styleUrl: './horarios.component.css'
})
export class HorariosComponent implements OnInit{

  dias: string[] = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
  indice: number = 0;
  horarios: any = [];
  horariosAux: any[] = [];
  onSpinner: boolean = true;
  especialidad: string[] = this.usuarioService.usuarioLogeado.especialidad;
  indiceEspecialidad: number = 0;
  lunes?: any;
  martes?: any;
  miercoles?: any;
  jueves?: any;
  viernes?: any;
  sabado?: any;

  constructor(
    private turnoService: TurnoService,
    private firestore: Firestore,
    private usuarioService: UsuarioService,
    private router: Router
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
      this.filtrarHorarioPorEspecialidad();
      this.onSpinner = false;
    } catch (error) {
        console.error("Error al obtener usuario:", error);
    }
  }

  filtrarHorarioPorEspecialidad(){
    this.horariosAux = [];
    this.horarios.forEach((horario: any) =>{
      if(horario.especialidad == this.especialidad[this.indiceEspecialidad])
        this.horariosAux.push(horario);
    });
    this.filtrarDia();
  }

  filtrarDia(){
    this.horariosAux.forEach((horario: any) =>{
      switch(horario.dia){
        case "Lunes":
          this.lunes = horario;
          break;
        case "Martes":
          this.martes = horario;
          break;
        case "Miercoles":
          this.miercoles = horario;
          break;
        case "Jueves":
          this.jueves = horario;
          break;
        case "Viernes":
          this.viernes = horario;
          break;
        case "Sabado":
          this.sabado = horario;
          break;
      }
    });
  }

  actualizarDisponibilidad(){
    this.lunes.disponibilidad.forEach((disponible: boolean, index: number) =>{
      if (index >= this.lunes.desde && index <= this.lunes.hasta) {
        this.lunes.disponibilidad[index] = true;
      }else{
        this.lunes.disponibilidad[index] = false;
      }
    });
    this.martes.disponibilidad.forEach((disponible: boolean, index: number) =>{
      if (index >= this.martes.desde && index <= this.martes.hasta) {
        this.martes.disponibilidad[index] = true;
      }else{
        this.martes.disponibilidad[index] = false;
      }
    });
    this.miercoles.disponibilidad.forEach((disponible: boolean, index: number) =>{
      if (index >= this.miercoles.desde && index <= this.miercoles.hasta) {
        this.miercoles.disponibilidad[index] = true;
      }else{
        this.miercoles.disponibilidad[index] = false;
      }
    });
    this.jueves.disponibilidad.forEach((disponible: boolean, index: number) =>{
      if (index >= this.jueves.desde && index <= this.jueves.hasta) {
        this.jueves.disponibilidad[index] = true;
      }else{
        this.jueves.disponibilidad[index] = false;
      }
    });
    this.viernes.disponibilidad.forEach((disponible: boolean, index: number) =>{
      if (index >= this.viernes.desde && index <= this.viernes.hasta) {
        this.viernes.disponibilidad[index] = true;
      }else{
        this.viernes.disponibilidad[index] = false;
      }
    });
    this.sabado.disponibilidad.forEach((disponible: boolean, index: number) =>{
      if (index >= this.sabado.desde && index <= this.sabado.hasta) {
        this.sabado.disponibilidad[index] = true;
      }else{
        this.sabado.disponibilidad[index] = false;
      }
    });
  }

  guardarHorarios(){
    this.onSpinner = true;
    this.actualizarDisponibilidad();
    if (this.turnoService.updateHorarios(this.horariosAux)) {
      Swal.fire({
        icon: "success",
        title: "Guardado !",
        text: "Los horarios se guardaron correctamente"
      });
      this.onSpinner = false;
      this.router.navigate(["/perfil"])
    }else{
      Swal.fire({
        icon: "error",
        title: "Error !",
        text: "No se pudieron guardar los horarios"
      });
      this.onSpinner = false;
    }
    
  }

  sumarEspecialidad(){
    if (this.indiceEspecialidad < this.especialidad.length - 1) {
      this.indiceEspecialidad++;
      this.filtrarHorarioPorEspecialidad();
    }else{
      this.restarEspecialidad();
      this.filtrarHorarioPorEspecialidad();
    }
  }

  restarEspecialidad(){
    if (this.indiceEspecialidad != 0) {
      this.indiceEspecialidad--;
      this.filtrarHorarioPorEspecialidad();
    }else{
      this.sumarEspecialidad();
      this.filtrarHorarioPorEspecialidad();
    }
  }
}
