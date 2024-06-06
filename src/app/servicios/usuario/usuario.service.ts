import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { query, where } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

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
    return signOut(this.auth);
  }

  getUserLogeado(){
    return this.auth.currentUser;
  }

  async isAdmin(){
    const user = this.getUserLogeado()?.email;
    if (user) {
      try {
          const userObj: any = await this.getUserByMail(user);
          return userObj?.user == 'admin';
      } catch (err) {
          console.log(err);
          return false;
      }
    }
    return false;
  }

  async isVerificadoPorAdmin() {
    const user = this.getUserLogeado()?.email;
    if (user) {
      try {
          const userObj: any = await this.getUserByMail(user);
          if (userObj?.user == 'especialista') {
            return userObj?.verificado;
          }
          return true;
      } catch (err) {
          console.log(err);
          return false;
      }
    }
    return false;
  }

  async getUserByMail (mail: string){
    const collPacientes = collection(this.firestore, "usuarios");
    const q = query(collPacientes, where("mail", "==", mail));
    let usuario;
    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach( doc => {
        usuario = doc.data();
      }); 
      return usuario;
    } catch (error) {
        console.error("Error al obtener usuario:", error);
        return null;
    }
  }

  isMailVerificated() : boolean{
    return this.auth.currentUser?.emailVerified!;
  }
}

