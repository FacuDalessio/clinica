import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard'
import { especialistaGuard } from './guards/especialista.guard';
import { pacienteGuard } from './guards/paciente.guard';
import { solicitarTurnoGuard } from './guards/solicitar-turno.guard';

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
        loadComponent: () => import('./componentes/usuarios-listado/usuarios-listado.component').then(c => c.UsuariosListadoComponent),
        canActivate: [adminGuard]
    },
    { path: 'perfil',
        loadComponent: () => import('./componentes/perfil/perfil.component').then(c => c.PerfilComponent),
        ...canActivate(()=> redirectUnauthorizedTo(['/login']))
    },
    { path: 'horarios',
        loadComponent: () => import('./componentes/horarios/horarios.component').then(c => c.HorariosComponent),
        canActivate: [especialistaGuard]
    },
    { path: 'solicitarTurno',
        loadComponent: () => import('./componentes/solicitar-turno/solicitar-turno.component').then(c => c.SolicitarTurnoComponent),
        canActivate: [solicitarTurnoGuard],
        children: [{
            path: 'elegirTurno',
            loadComponent: () => import('./componentes/solicitar-turno/elegir-turno/elegir-turno.component').then(c => c.ElegirTurnoComponent)
        }]
    },
    { path: 'misTurnos',
        loadComponent: () => import('./componentes/mis-turnos/mis-turnos.component').then(c => c.MisTurnosComponent),
        // ...canActivate(()=> redirectUnauthorizedTo(['/login']))
    },
];
