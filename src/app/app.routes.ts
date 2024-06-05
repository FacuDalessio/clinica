import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: "full" },
    { path: 'home',
        loadComponent: () => import('./componentes/bienvenido/bienvenido.component').then(c => c.BienvenidoComponent) 
    },
    { path: 'registro',
        loadComponent: () => import('./componentes/registro/registro.component').then(c => c.RegistroComponent) 
    },
    { path: 'registroEspecialista',
        loadComponent: () => import('./componentes/registro-especialista/registro-especialista.component').then(c => c.RegistroEspecialistaComponent) 
    },
    { path: 'registroAdministrador',
        loadComponent: () => import('./componentes/registro-administrador/registro-administrador.component').then(c => c.RegistroAdministradorComponent) 
    },
    { path: 'login',
        loadComponent: () => import('./componentes/login/login.component').then(c => c.LoginComponent) 
    },
    { path: 'usuarios',
        loadComponent: () => import('./componentes/usuarios-listado/usuarios-listado.component').then(c => c.UsuariosListadoComponent) 
    }
];
