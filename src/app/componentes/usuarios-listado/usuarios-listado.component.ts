import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Firestore, QueryDocumentSnapshot, QuerySnapshot, collection, onSnapshot, orderBy, query } from '@angular/fire/firestore';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-usuarios-listado',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './usuarios-listado.component.html',
  styleUrl: './usuarios-listado.component.css'
})
export class UsuariosListadoComponent implements OnInit{

  usuarios: any[] = [];
  onSpinner: boolean = true;

  constructor(
    private firestore: Firestore
  ){}

  ngOnInit(): void {
    const q = query(collection(this.firestore, "usuarios"), orderBy('nombre', 'asc'));
    onSnapshot(q, (snapshot: QuerySnapshot) => {
      snapshot.forEach((doc: QueryDocumentSnapshot) => {
        let obraSocial = 'N/A';
        let especialidad = 'N/A';
        if(doc.data()['especialidad'])
          especialidad = doc.data()['especialidad'];
        if(doc.data()['obraSocial'])
          obraSocial = doc.data()['obraSocial'];
        const usuario = {
          nombre: doc.data()['nombre'],
          apellido: doc.data()['apellido'],
          edad: doc.data()['edad'],
          dni: doc.data()['dni'],
          especialidad: especialidad,
          obraSocial: obraSocial,
          mail: doc.data()['mail']
        }

        this.usuarios.push(usuario);
      });

      this.onSpinner = false;
    });
  }
}
