import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Firestore, QueryDocumentSnapshot, QuerySnapshot, collection, onSnapshot, orderBy, query } from '@angular/fire/firestore';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { UsuarioService } from '../../servicios/usuario/usuario.service';
import { Router, RouterLink } from '@angular/router';
import {MatTableModule} from '@angular/material/table';
import { utils, writeFileXLSX } from 'xlsx';

@Component({
  selector: 'app-usuarios-listado',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatTableModule,
    RouterLink
  ],
  templateUrl: './usuarios-listado.component.html',
  styleUrl: './usuarios-listado.component.css'
})
export class UsuariosListadoComponent implements OnInit{

  usuarios: any[] = [];
  pacientes: any[] = [];
  turnos: any[] = [];
  turnosAux: any[] = [];
  onSpinner: boolean = true;

  constructor(
    private firestore: Firestore,
    private usuarioService: UsuarioService,
    private router: Router
  ){}

  ngOnInit(): void {
    const q = query(collection(this.firestore, "usuarios"), orderBy('nombre', 'asc'));
    onSnapshot(q, (snapshot: QuerySnapshot) => {
      this.usuarios = [];
      snapshot.forEach((doc: QueryDocumentSnapshot) => {
        let obraSocial = 'N/A';
        let especialidad = 'N/A';
        let verificado = 'N/A';
        let imgs = [];
        if(doc.data()['especialidad']){
          especialidad = doc.data()['especialidad'];
          especialidad = especialidad[1] ? `${especialidad[0]}, ${especialidad[1]}` : especialidad[0];
          verificado = doc.data()['verificado'];
        }
        if(doc.data()['obraSocial'])
          obraSocial = doc.data()['obraSocial'];
          
        if(doc.data()['imgs'])
          imgs = doc.data()['imgs'];

        const usuario = {
          nombre: doc.data()['nombre'],
          apellido: doc.data()['apellido'],
          edad: doc.data()['edad'],
          dni: doc.data()['dni'],
          especialidad: especialidad,
          obraSocial: obraSocial,
          mail: doc.data()['mail'],
          user: doc.data()['user'],
          verificado: verificado,
          imgs: imgs,
          ref: doc.ref
        }
        this.usuarios.push(usuario);
        if(usuario.user == 'paciente')
          this.pacientes.push(usuario);
      });
      const qTurnos = query(collection(this.firestore, "turnos"), orderBy('fecha', 'desc'));
      onSnapshot(qTurnos, (snapshot: QuerySnapshot) => {
        snapshot.forEach((doc: QueryDocumentSnapshot) => {
         this.turnos.push(doc.data());
        });
      });
      this.onSpinner = false;
    });
  }

  async habilitarDeshabilitar(usuario: any){
    usuario.verificado = !usuario.verificado;
    const ref = usuario.ref;
    delete usuario.ref;
    const result = await this.usuarioService.updateUsuario(usuario, ref);
    if (result) {
      console.log('se actualizo el usuario');
    }else{
      console.log('error en actualizar');
      usuario.verificado = false;
    }
  }

  verHistoriaMedica(usuario: any){
    console.log(usuario);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('emailUsuario', JSON.stringify(usuario.mail));
      localStorage.setItem('user', JSON.stringify(usuario.user));
    }
    this.router.navigate(['/historiaMedica']);
  }

  descargarCsv(){
    const ws = utils.json_to_sheet(this.usuarios);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Data");
    writeFileXLSX(wb, "ListadoUsuarios.xlsx");

  }

  descargarDatosPaciente(paciente: any){
    this.turnosAux = [];
    this.turnos.forEach((turno: any) =>{
      if (turno.paciente.dni == paciente.dni)
        this.turnosAux.push({
          fecha: turno.fecha.toDate(),
          especialista: turno.especialista.apellido + ', ' + turno.especialista.nombre,
          especialidad: turno.especialidad
        });
    });

    const ws = utils.json_to_sheet(this.turnosAux);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Data");
    writeFileXLSX(wb, "Turnos" + paciente.apellido + paciente.nombre + ".xlsx");
  }
}
