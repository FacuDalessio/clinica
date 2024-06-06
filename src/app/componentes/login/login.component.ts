import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '../../servicios/usuario/usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  
  mensajeError: string = '';
  form: FormGroup = new FormGroup({
    'mail': new FormControl('', [Validators.required, Validators.email]),
    'password': new FormControl('', Validators.required)
  });

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ){}

  ngOnInit(): void {
      
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

  login(){
    this.mensajeError = '';
    this.usuarioService.login(this.mail?.value, this.password?.value)
    .then(response =>{ 
      if (this.usuarioService.isMailVerificated()) {
        this.usuarioService.isVerificadoPorAdmin()
        .then(response =>{
          if(response){
            this.router.navigate(['/']);
          }else{
            this.mensajeError = 'El admin no te verifico';
            this.usuarioService.logOut();    
          }
        });
      }else{
        this.mensajeError = 'No verificaste el mail';
        this.usuarioService.logOut();
      }
    })
    .catch(error => {
      console.log(error);
      this.mensajeError = 'Credenciales invalidas';
    })
  }
}
