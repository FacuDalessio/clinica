import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { repetirClaveValidator } from '../../validadores/clave.validator';
import { Router, RouterLink } from '@angular/router';
import { UsuarioService } from '../../servicios/usuario/usuario.service';
import { Firestore, addDoc, query } from '@angular/fire/firestore';
import { Storage, getDownloadURL, ref, uploadBytes } from '@angular/fire/storage';
import { QueryDocumentSnapshot, QuerySnapshot, collection, onSnapshot } from 'firebase/firestore';
import { Especialista } from '../../entidades/especialista';
import { sendEmailVerification } from '@angular/fire/auth';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TurnoService } from '../../servicios/turno/turno.service';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';

@Component({
  selector: 'app-registro-especialista',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    MatProgressSpinnerModule,
    RouterLink,
    RecaptchaModule,
    RecaptchaFormsModule
  ],
  templateUrl: './registro-especialista.component.html',
  styleUrl: './registro-especialista.component.css'
})
export class RegistroEspecialistaComponent implements OnInit{

  onSpinner: boolean = false;
  agregar: boolean = false;
  especialidades: string[] = [];
  mensajeError: string = '';
  imgInput: string = '';
  imgUrl: string = '';
  form: FormGroup = new FormGroup({
    'nombre': new FormControl('', [Validators.required]),
    'apellido': new FormControl('', [Validators.required]),
    'edad': new FormControl('', [Validators.required, Validators.min(18), Validators.max(120)]),
    'dni': new FormControl('', [Validators.required, Validators.maxLength(8), Validators.minLength(8)]),
    'especialidad': new FormControl('', [Validators.required]),
    'mail': new FormControl('', [Validators.required, Validators.email]),
    'password': new FormControl('', [Validators.required, Validators.minLength(6)]),
    'repetirPassword': new FormControl('', [Validators.required]),
    'img': new FormControl('', [Validators.required]),
    'inpAgregar': new FormControl(''),
    'recaptcha': new FormControl('', [Validators.required])
  }, repetirClaveValidator());

  constructor(
    private router: Router,
    private usuarioService: UsuarioService,
    private firestore: Firestore,
    private storage: Storage,
    private turnoService: TurnoService
  ){}

  ngOnInit(): void {
    const q = query(collection(this.firestore, "especialidades"));
    onSnapshot(q, (snapshot: QuerySnapshot) => {
      snapshot.forEach((doc: QueryDocumentSnapshot) => {
        this.especialidades.push(doc.data()['detalle']);
      });
    });
  }

  onChangeEspecialidad($event: any) {
    if ($event.target.value == 'agregar') {
      this.agregar = true;
    } else {
      this.agregar = false;
    }
  }

  agregarEspecialidad(){
    const especialidad = this.inpAgregar?.value.toLowerCase();
    let col = collection(this.firestore, 'especialidades');
    addDoc(col, { detalle: especialidad });
    this.agregar = false;
    this.especialidades = [];
  }

  get inpAgregar(){
    return this.form.get('inpAgregar');
  }

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

  get especialidad() {
    return this.form.get('especialidad');
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

  recaptchaHasError() {
    const control = this.form?.get('recaptcha');
    return control?.touched && control?.invalid ? 'Captcha es requerido' : '';
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

  especialidadHasError() : string{
    if (this.especialidad?.dirty || this.especialidad?.touched) {
      if(this.especialidad?.hasError('required'))
        return 'La especialidad es requerida';
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

  registroEspecialista(){
    this.onSpinner = true;
    const especialista = new Especialista(
      { nombre: this.nombre?.value, apellido: this.apellido?.value },
      this.edad?.value,
      this.dni?.value,
      [this.especialidad?.value],
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
            nombre: especialista.nombre,
            apellido: especialista.apellido,
            edad: especialista.edad,
            dni: especialista.dni,
            especialidad: especialista.especialidad,
            mail: especialista.mail.toLowerCase(),
            password: especialista.password,
            img: this.imgUrl,
            user: 'especialista',
            verificado: false
        });
    })
    .then(response => {
        return sendEmailVerification(this.usuarioService.getUserLogeado()!);
    })
    .then(response => {
        this.turnoService.generarHorariosSemana(especialista, especialista.especialidad[0])
        .then(response => {
          this.onSpinner = false;
          this.router.navigate(['/login']);
        });
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
