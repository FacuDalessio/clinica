import { Component, OnInit } from '@angular/core';
import { Firestore, collection, doc, getDoc, onSnapshot, where } from '@angular/fire/firestore';
import { QueryDocumentSnapshot, QuerySnapshot, query } from 'firebase/firestore';
import { UsuarioService } from '../../servicios/usuario/usuario.service';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-historia-medica',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './historia-medica.component.html',
  styleUrl: './historia-medica.component.css'
})
export class HistoriaMedicaComponent implements OnInit{

  historiasMedicas: any[] = [];
  onSpinner: boolean = true;

  constructor(
    private firestore: Firestore,
    private userService: UsuarioService
  ){}

  ngOnInit(): void {
    if (this.userService.usuarioLogeado.user == 'paciente') {
      const qEspecialistas = query(collection(this.firestore, "historiaMedica"));
      onSnapshot(qEspecialistas, (snapshot: QuerySnapshot) => {
        snapshot.forEach((doc: QueryDocumentSnapshot) => {
          if (doc.data()['paciente'].mail == this.userService.usuarioLogeado.mail) {
            const historiaMedica: any = doc.data();
            historiaMedica.ref = doc.ref;
            historiaMedica.verTurno = false;
            historiaMedica.fecha = historiaMedica.fecha.toDate();
            this.historiasMedicas.push(historiaMedica);
          }
        });
        this.onSpinner = false;
      });
    }
    if (this.userService.usuarioLogeado.user == 'especialista') {
      const qEspecialistas = query(collection(this.firestore, "historiaMedica"));
      onSnapshot(qEspecialistas, (snapshot: QuerySnapshot) => {
        snapshot.forEach((doc: QueryDocumentSnapshot) => {
          if (doc.data()['especialista'].mail == this.userService.usuarioLogeado.mail) {
            const historiaMedica: any = doc.data();
            historiaMedica.ref = doc.ref;
            historiaMedica.fecha = historiaMedica.fecha.toDate();
            this.historiasMedicas.push(historiaMedica);
          }
        });
        this.onSpinner = false;
      });
    }

    if (this.userService.usuarioLogeado.user == 'admin') {
      const qEspecialistas = query(collection(this.firestore, "historiaMedica"));
      onSnapshot(qEspecialistas, (snapshot: QuerySnapshot) => {
        snapshot.forEach((doc: QueryDocumentSnapshot) => {
          if (JSON.parse(localStorage.getItem('user')!) == 'paciente') {
            if (doc.data()['paciente'].mail == JSON.parse(localStorage.getItem('emailUsuario')!)) {
              const historiaMedica: any = doc.data();
              historiaMedica.ref = doc.ref;
              historiaMedica.fecha = historiaMedica.fecha.toDate();
              this.historiasMedicas.push(historiaMedica);
            }
          }else{
            if (doc.data()['especialista'].mail == JSON.parse(localStorage.getItem('emailUsuario')!)) {
              const historiaMedica: any = doc.data();
              historiaMedica.ref = doc.ref;
              historiaMedica.fecha = historiaMedica.fecha.toDate();
              this.historiasMedicas.push(historiaMedica);
            }
          }
        });
        this.onSpinner = false;
      });
    }
  }

  async verTurno(historiaMedica: any){
    const docRef = doc(this.firestore, "turnos", historiaMedica.turno);
    const docSnap = await getDoc(docRef);
    historiaMedica.verTurno = docSnap.data();
    historiaMedica.verTurno.fecha = historiaMedica.verTurno.fecha.toDate();
  }
}
