import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../servicios/usuario/usuario.service';
import { MatIconModule } from '@angular/material/icon';
import { Firestore, QueryDocumentSnapshot, QuerySnapshot, addDoc, collection, onSnapshot, query } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit{

  especialidades: string[] = [];
  inpEspecialidad: string = '';
  especialidadAgregada: string = '';
  agregar: boolean = false;
  btnAgregarEspecialidad: boolean = false;
  btnPrincipalAgregar: boolean = false;
  indiceImagenPaciente: number = 0;

  constructor(
    public usarioService: UsuarioService,
    private firestore: Firestore,
  ){}

  ngOnInit(): void {
    const q = query(collection(this.firestore, "especialidades"));
    onSnapshot(q, (snapshot: QuerySnapshot) => {
      snapshot.forEach((doc: QueryDocumentSnapshot) => {
        this.especialidades.push(doc.data()['detalle']);
      });
    });
    if(this.usarioService.usuarioLogeado.especialidad && this.usarioService.usuarioLogeado.especialidad != 'N/A' && !this.usarioService.usuarioLogeado.especialidad[1]){
      this.btnPrincipalAgregar = true;
    }
  }

  onChangeEspecialidad($event: any) {
    if ($event.target.value == 'agregar') {
      this.agregar = true;
    } else {
      this.agregar = false;
    }
  }

  agregarEspecialidadDb(){
    const especialidad = this.inpEspecialidad.toLowerCase();
    let col = collection(this.firestore, 'especialidades');
    addDoc(col, { detalle: especialidad });
    this.agregar = false;
    this.especialidades = [];
  }

  updateEspecialista(){
    this.btnAgregarEspecialidad = false;
    this.btnPrincipalAgregar = false;
    this.usarioService.usuarioLogeado.especialidad.push(this.especialidadAgregada);
    this.usarioService.updateUsuario(this.usarioService.usuarioLogeado, this.usarioService.usuarioLogeado.ref);
  }

  cambiarImagenPaciente(){
    if (this.indiceImagenPaciente == 0) {
      this.indiceImagenPaciente = 1;
    }else{
      this.indiceImagenPaciente = 0;
    }
  }
}
