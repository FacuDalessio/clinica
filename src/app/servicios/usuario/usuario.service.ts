import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, collection, getDocs, updateDoc } from '@angular/fire/firestore';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { DocumentData, DocumentReference, query, where } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuarioLogeado: any = {
    nombre: "Nicolas",
    apellido: "Ferro",
    edad: 54,
    dni: "19837453",
    obraSocial: "N/A",
    mail: "03ofjt9p@cj.mintemail.com",
    especialidad: ["pediatria", "cardiologia"],
    user: 'especialista',
    img: "https://firebasestorage.googleapis.com/v0/b/clinica-af1bb.appspot.com/o/images%2Ffrancella1.jpg?alt=media&token=3a1ab86b-e6d2-4909-bc43-3d83116bdc86"
  };

  // usuarioLogeado: any = {
  //   nombre: "Carlos",
  //   apellido: "Perez",
  //   edad: 47,
  //   dni: "20738293",
  //   mail: "dsy8ov10@cj.mintemail.com",
  //   obraSocial: "Luis pasteur",
  //   user: 'paciente',
  //   imgs: [
  //     "https://firebasestorage.googleapis.com/v0/b/clinica-af1bb.appspot.com/o/images%2FsethRogen.jpg?alt=media&token=1e385b88-97c3-4c24-b084-8801f754014a",
  //     "https://firebasestorage.googleapis.com/v0/b/clinica-af1bb.appspot.com/o/images%2FsethRogen2.jpg?alt=media&token=778a9f0a-2a2a-46c4-ace0-a866b989b1e5"
  //   ]
  // };

  // usuarioLogeado: any = {
  //   nombre: "Norman",
  //   apellido: "Lacconi",
  //   edad: 47,
  //   dni: "19837453",
  //   mail: "bvc6q5fh@cj.mintemail.com",
  //   user: 'admin',
  //   img: "https://firebasestorage.googleapis.com/v0/b/clinica-af1bb.appspot.com/o/images%2Fperetti.jpg?alt=media&token=bbd2cfb7-e9d1-4d06-aed7-97321befb3dc"
  // };

  // usuarioLogeado: any;

  constructor(
    private auth:Auth,
    private firestore: Firestore
  ) { }

  registro(email: string, password: string){
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  async login(email: string, password: string){
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logOut(){
    this.usuarioLogeado = null;
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

  async isVerificadoPorAdmin(): Promise<boolean> {
    const user = this.getUserLogeado()?.email;
    if (user) {
        try {
            const userObj: any = await this.getUserByMail(user);
            this.usuarioLogeado = userObj;
            if (userObj?.user === 'especialista') {
                return !!userObj?.verificado;
            }
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }
    return true;
  }

  async getUserByMail (mail: string){
    const collPacientes = collection(this.firestore, "usuarios");
    const q = query(collPacientes, where("mail", "==", mail));
    let usuario: any;
    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach( doc => {
        usuario = doc.data();
        usuario.ref = doc.ref;
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

  async updateUsuario(usuario: any, ref: DocumentReference<DocumentData, DocumentData>): Promise<boolean> {
    try {
        await updateDoc(ref, usuario);
        return true;
    } catch (error) {
        console.error("Error al actualizar usuario:", error);
        return false;
    }
  }
}

