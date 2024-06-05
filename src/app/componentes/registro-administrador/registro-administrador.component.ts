import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { repetirClaveValidator } from '../../validadores/clave.validator';
import { Storage, getDownloadURL, ref, uploadBytes } from '@angular/fire/storage';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { UsuarioService } from '../../servicios/usuario/usuario.service';
import { Administrador } from '../../entidades/administrador';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-registro-administrador',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './registro-administrador.component.html',
  styleUrl: './registro-administrador.component.css'
})
export class RegistroAdministradorComponent {

  onSpinner: boolean = false;
  mensajeError: string = '';
  imgInput: string = '';
  imgUrl: string = '';
  form: FormGroup = new FormGroup({
    'nombre': new FormControl('', [Validators.required]),
    'apellido': new FormControl('', [Validators.required]),
    'edad': new FormControl('', [Validators.required, Validators.min(18), Validators.max(120)]),
    'dni': new FormControl('', [Validators.required, Validators.maxLength(8), Validators.minLength(8)]),
    'mail': new FormControl('', [Validators.required, Validators.email]),
    'password': new FormControl('', [Validators.required, Validators.minLength(6)]),
    'repetirPassword': new FormControl('', [Validators.required]),
    'img': new FormControl('', [Validators.required])
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

  get mail() {
    return this.form.get('mail');
  }

  get password() {
    return this.form.get('password');
  }

  get repetirPassword() {
    return this.form.get('repetirPassword');
  }

  get img() {
    return this.form.get('img');
  }

  nombreHasError() : string{
    if (this.nombre?.dirty || this.nombre?.touched) {
      if(this.nombre?.hasError('required'))
        return 'El nombre es requerido';
    }
    return '';
  }

  imgHasError() : string{
    if (this.img?.dirty || this.img?.touched) {
      if(this.img?.hasError('required'))
        return 'La imagene es requerida';
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

  getFile($event: any){
    this.imgInput =$event.target.files[0];
  }

  uploadImage(file: any): Promise<any> {
    const imgRef = ref(this.storage, `images/${file.name}`);
    return uploadBytes(imgRef, file)
      .then(async response => {
          const url = await getDownloadURL(imgRef);
          this.imgUrl = url;
          return url;
      })
      .catch(error => console.log(error));
  }

  registroAdministrador(){
    this.onSpinner = true;
    const administrador = new Administrador(
      { nombre: this.nombre?.value, apellido: this.apellido?.value },
      this.edad?.value,
      this.dni?.value,
      this.mail?.value,
      this.password?.value,
      ''
    );

    this.mensajeError = '';

    this.usuarioService.registro(this.mail?.value, this.password?.value)
    .then(response => {
      return this.uploadImage(this.imgInput);
    })
    .then(() => {
        let col = collection(this.firestore, 'usuarios');
        return addDoc(col, {
            nombre: administrador.nombre,
            apellido: administrador.apellido,
            edad: administrador.edad,
            dni: administrador.dni,
            mail: administrador.mail,
            password: administrador.password,
            img: this.imgUrl,
            admin: false
        });
    })
    .then(response => {
        this.usuarioService.logOut();
        this.onSpinner = false;
        this.router.navigate(['/usuarios']);
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
