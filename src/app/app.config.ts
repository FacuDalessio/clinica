import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideFirebaseApp(() => initializeApp({"projectId":"clinica-af1bb","appId":"1:653605611366:web:096556018fa9d4ec9d0aa7","storageBucket":"clinica-af1bb.appspot.com","apiKey":"AIzaSyAcNAVEtMfJAXPkW_wBzxTPOeUsvuvubYY","authDomain":"clinica-af1bb.firebaseapp.com","messagingSenderId":"653605611366"})), 
  provideAuth(() => getAuth()), provideFirestore(() => getFirestore()), provideAnimationsAsync()]
};
