import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: "full" },
    { path: 'home',
        loadComponent: () => import('./componentes/bienvenido/bienvenido.component').then(c => c.BienvenidoComponent) 
    },
    { path: 'registro',
        loadComponent: () => import('./componentes/registro/registro.component').then(c => c.RegistroComponent) 
    }
];
