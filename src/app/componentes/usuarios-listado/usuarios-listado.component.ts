import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Paciente } from '../../entidades/paciente';
import { Firestore, QueryDocumentSnapshot, QuerySnapshot, collection, onSnapshot, orderBy, query } from '@angular/fire/firestore';
import {MatTableModule} from '@angular/material/table';
import { Especialista } from '../../entidades/especialista';
import { Administrador } from '../../entidades/administrador';

@Component({
  selector: 'app-usuarios-listado',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule
  ],
  templateUrl: './usuarios-listado.component.html',
  styleUrl: './usuarios-listado.component.css'
})
export class UsuariosListadoComponent implements OnInit{

  pacientes: Paciente[] = [];
  especialistas: Especialista[] = [];
  administradores: Administrador[] = [];

  constructor(
    private firestore: Firestore
  ){}

  ngOnInit(): void {
    const qPac = query(collection(this.firestore, "pacientes"), orderBy('nombre', 'asc'));
    onSnapshot(qPac, (snapshot: QuerySnapshot) => {
      snapshot.forEach((doc: QueryDocumentSnapshot) => {
        const paciente = new Paciente(
          {nombre: doc.data()['nombre'], apellido: doc.data()['apellido']},
          doc.data()['edad'],
          doc.data()['dni'],
          doc.data()['obraSocial'],
          doc.data()['mail'],
          doc.data()['password'],
          doc.data()['imgs'],
        );

        this.pacientes.push(paciente);
      });
    });

    const qEspe = query(collection(this.firestore, "especialistas"), orderBy('nombre', 'asc'));
    onSnapshot(qEspe, (snapshot: QuerySnapshot) => {
      snapshot.forEach((doc: QueryDocumentSnapshot) => {
        const especialista = new Especialista(
          {nombre: doc.data()['nombre'], apellido: doc.data()['apellido']},
          doc.data()['edad'],
          doc.data()['dni'],
          doc.data()['especialidad'],
          doc.data()['mail'],
          doc.data()['password'],
          doc.data()['imgs'],
        );

        this.especialistas.push(especialista);
      });
    });

    const qAdmin = query(collection(this.firestore, "administradores"), orderBy('nombre', 'asc'));
    onSnapshot(qAdmin, (snapshot: QuerySnapshot) => {
      snapshot.forEach((doc: QueryDocumentSnapshot) => {
        const administrador = new Administrador(
          {nombre: doc.data()['nombre'], apellido: doc.data()['apellido']},
          doc.data()['edad'],
          doc.data()['dni'],
          doc.data()['mail'],
          doc.data()['password'],
          doc.data()['imgs'],
        );

        this.administradores.push(administrador);
      });
    });
  }
}
