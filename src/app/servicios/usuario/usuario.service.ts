import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { query, where } from 'firebase/firestore';
import { Paciente } from '../../entidades/paciente';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuarioLogeado: any;

  constructor(
    private auth:Auth,
    private firestore: Firestore
  ) { }

  registro(email: string, password: string){
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  login(email: string, password: string){
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logOut(){
    this.usuarioLogeado = null;
    return signOut(this.auth);
  }

  getUserLogeado(){
    return this.auth.currentUser;
  }

  async getUserByMail (mail: string){
    try {
      const paciente = await this.getPacienteByMail(mail);
      if(paciente != null)
        return paciente;
    } catch (error) {
      console.error("Error al obtener paciente por correo:", error);
      return null;
    }
    
    return 'vacio';
  }

  isMailVerificated() : boolean{
    return this.auth.currentUser?.emailVerified!;
  }

  async getPacienteByMail(mail: string){
    const collPacientes = collection(this.firestore, "pacientes");
    const q = query(collPacientes, where("mail", "==", mail));
    let paciente;
    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach( doc => {
        paciente = new Paciente(
          {nombre: doc.data()['nombre'], apellido: doc.data()['apellido']},
          doc.data()['edad'],
          doc.data()['dni'],
          doc.data()['obraSocial'],
          doc.data()['mail'],
          doc.data()['password'],
          doc.data()['imgs']
        );
      });
      return paciente;  
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
    }
  }
}

