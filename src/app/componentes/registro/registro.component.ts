import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { repetirClaveValidator } from '../../validadores/clave.validator';
import { Paciente } from '../../entidades/paciente';
import { UsuarioService } from '../../servicios/usuario/usuario.service';
import { Router } from '@angular/router';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { sendEmailVerification } from '@angular/fire/auth';
import { Storage, ref, uploadBytes } from '@angular/fire/storage';
import { getDownloadURL } from 'firebase/storage';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {

  onSpinner: boolean = false;
  mensajeError: string = '';
  imgsInput: string[] = [];
  imgsUrl: string[] = [];
  form: FormGroup = new FormGroup({
    'nombre': new FormControl('', [Validators.required]),
    'apellido': new FormControl('', [Validators.required]),
    'edad': new FormControl('', [Validators.required, Validators.min(18), Validators.max(120)]),
    'dni': new FormControl('', [Validators.required, Validators.maxLength(8), Validators.minLength(8)]),
    'obraSocial': new FormControl('', [Validators.required]),
    'mail': new FormControl('', [Validators.required, Validators.email]),
    'password': new FormControl('', [Validators.required, Validators.minLength(6)]),
    'repetirPassword': new FormControl('', [Validators.required]),
    'imgs': new FormControl('', [Validators.required])
  }, repetirClaveValidator());

  constructor(
    private router: Router,
    private usuarioService: UsuarioService,
    private firestore: Firestore,
    private storage: Storage
  ){}

  get nombre(){
    return this.form.get('nombre');
  }

  get apellido(){
    return this.form.get('apellido');
  }

  get edad() {
    return this.form.get('edad');
  }

  get dni() {
    return this.form.get('dni');
  }

  get obraSocial() {
    return this.form.get('obraSocial');
  }

  get mail() {
    return this.form.get('mail');
  }

  get password() {
    return this.form.get('password');
  }

  get repetirPassword() {
    return this.form.get('repetirPassword');
  }

  get imgs() {
    return this.form.get('imgs');
  }

  nombreHasError() : string{
    if (this.nombre?.dirty || this.nombre?.touched) {
      if(this.nombre?.hasError('required'))
        return 'El nombre es requerido';
    }
    return '';
  }

  imgsHasError() : string{
    if (this.imgs?.dirty || this.imgs?.touched) {
      if(this.imgs?.hasError('required'))
        return 'Las imagenes son requeridas';
    }
    return '';
  }

  apellidoHasError() : string{
    if (this.apellido?.dirty || this.apellido?.touched) {
      if(this.apellido?.hasError('required'))
        return 'El apellido es requerido';
    }
    return '';
  }

  edadHasError() : string{
    if(this.edad?.hasError('min'))
      return 'No es mayor de edad';
    if(this.edad?.hasError('max'))
      return 'Edad invalida';
    if (this.edad?.dirty || this.edad?.touched) {
      if(this.edad?.hasError('required'))
        return 'La edad es requerida';
    }
    return '';
  }

  dniHasError() : string{
    if (this.dni?.dirty || this.dni?.touched) {
      if(this.dni?.hasError('required'))
        return 'El dni es requerido';
    }
    if (this.dni?.dirty || this.dni?.touched){
      if(this.dni?.errors)
        return 'El dni es invalido';
    }
    return '';
  }

  obraSocialHasError() : string{
    if (this.obraSocial?.dirty || this.obraSocial?.touched) {
      if(this.obraSocial?.hasError('required'))
        return 'La obra social es requerida';
    }
    return '';
  }

  mailHasError() : string{
    if (this.mail?.dirty || this.mail?.touched) {
      if(this.mail?.hasError('required'))
        return 'El nombre es requerido';
    }
    if(this.mail?.hasError('email'))
      return 'Mail invalido';
    return '';
  }

  passwordHasError() : string{
    if (this.password?.dirty || this.password?.touched) {
      if(this.password?.hasError('required'))
        return 'La contraseña es requerida';
      if(this.password?.errors)
        return 'La contraseña tiene que tener mas de 5 caracteres';
    }
    return '';
  }

  uploadImage(file: any): Promise<any> {
    const imgRef = ref(this.storage, `images/${file.name}`);
    return uploadBytes(imgRef, file)
      .then(async response => {
          const url = await getDownloadURL(imgRef);
          this.imgsUrl.push(url);
          return url;
      })
      .catch(error => console.log(error));
  }

  getFiles($event: any){
    this.imgsInput.push($event.target.files[0]);
    this.imgsInput.push($event.target.files[1]);
  }

  registroPaciente() {
    this.onSpinner = true;
    const paciente = new Paciente(
        { nombre: this.nombre?.value, apellido: this.apellido?.value },
        this.edad?.value,
        this.dni?.value,
        this.obraSocial?.value,
        this.mail?.value,
        this.password?.value,
        []
    );

    this.mensajeError = '';

    this.usuarioService.registro(this.mail?.value, this.password?.value)
    .then(response => {
        let uploadPromises = this.imgsInput.map(file => this.uploadImage(file));
        return Promise.all(uploadPromises);
    })
    .then(() => {
        let col = collection(this.firestore, 'usuarios');
        return addDoc(col, {
            nombre: paciente.nombre,
            apellido: paciente.apellido,
            edad: paciente.edad,
            dni: paciente.dni,
            obraSocial: paciente.obraSocial,
            mail: paciente.mail.toLowerCase(),
            password: paciente.password,
            imgs: this.imgsUrl,
            user: 'paciente'
        });
    })
    .then(response => {
        return sendEmailVerification(this.usuarioService.getUserLogeado()!);
    })
    .then(response => {
        this.usuarioService.logOut();
        this.onSpinner = false;
        this.router.navigate(['/login']);
    })
    .catch(error => {
        console.log(error);
        if (error.code === 'auth/email-already-in-use') {
            this.onSpinner = false;
            this.mensajeError = 'Ya existe una cuenta con ese mail';
        } else if (error.code === 'auth/weak-password') {
            this.onSpinner = false;
            this.mensajeError = 'La contraseña tiene que tener mas de 5 caracteres';
        } else if (error.code === 'auth/invalid-email') {
            this.onSpinner = false;
            this.mensajeError = 'El mail es invalido';
        }
    });
    
  }
}
