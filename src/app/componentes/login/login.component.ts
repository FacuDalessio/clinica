import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '../../servicios/usuario/usuario.service';
import { Router, RouterLink } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    RouterLink
  ],
  animations: [
    trigger('enterState', [
      state('void', style({
        opacity: 0,
        transform: 'translateX(100%)'
      })),
      transition(':enter', [
        animate(300, style({
          transform: 'translateX(0)',
          opacity: 1
        }))
      ])
    ])
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  
  onSpinner: boolean = false;
  mensajeError: string = '';
  form: FormGroup = new FormGroup({
    'mail': new FormControl('', [Validators.required, Validators.email]),
    'password': new FormControl('', Validators.required)
  });

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ){}

  get mail() {
    return this.form.get('mail');
  }

  get password() {
    return this.form.get('password');
  }

  get repetirPassword() {
    return this.form.get('repetirPassword');
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

  async login(){
    this.onSpinner = true;
    this.mensajeError = '';
    this.usuarioService.login(this.mail?.value, this.password?.value)
    .then(response =>{ 
      if (this.usuarioService.isMailVerificated()) {
        this.usuarioService.isVerificadoPorAdmin()
        .then(response =>{
          if(!!response){
            this.onSpinner = false;
            this.router.navigate(['/home']);
          }else{
            this.onSpinner = false;
            this.mensajeError = 'El admin no te verifico';
            this.usuarioService.logOut();    
          }
        });
      }else{
        this.onSpinner = false;
        this.mensajeError = 'No verificaste el mail';
        this.usuarioService.logOut();
      }
    })
    .catch(error => {
      this.onSpinner = false;
      console.log(error);
      this.mensajeError = 'Credenciales invalidas';
    })
  }

  paciente1(){
    this.form.setValue({
      'mail': 'dsy8ov10@cj.MintEmail.com',
      'password': '123456'
    });
  }

  paciente2(){
    this.form.setValue({
      'mail': '760f4wxs@cj.MintEmail.com',
      'password': '123456'
    });
  }

  paciente3(){
    this.form.setValue({
      'mail': '6lrpn4sd@cj.MintEmail.com',
      'password': '123456'
    });
  }

  especialista1(){
    this.form.setValue({
      'mail': '03ofjt9p@cj.MintEmail.com',
      'password': '123456'
    });
  }

  especialista2(){
    this.form.setValue({
      'mail': 'jr31eaoi@cj.MintEmail.com',
      'password': '123456'
    });
  }

  admin(){
    this.form.setValue({
      'mail': 'bvc6q5fh@cj.MintEmail.com',
      'password': '123456'
    });
  }
}
