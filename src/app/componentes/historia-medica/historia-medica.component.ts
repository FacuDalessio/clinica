import { Component, OnInit } from '@angular/core';
import { Firestore, collection, doc, getDoc, onSnapshot, orderBy} from '@angular/fire/firestore';
import { QueryDocumentSnapshot, QuerySnapshot, query } from 'firebase/firestore';
import { UsuarioService } from '../../servicios/usuario/usuario.service';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { animate, state, style, transition, trigger } from '@angular/animations';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { NombreApellidoPipe } from '../../pipes/nombre-apellido.pipe';
import { CamelCasePipe } from '../../pipes/camel-case.pipe';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-historia-medica',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    NombreApellidoPipe,
    CamelCasePipe
  ],
  animations: [
    trigger('shownHidden', [
      state('shown', style({
        opacity: 1,
        transform: 'translateY(0px)'
      })),
      state('hidden', style({
        opacity: 0,
        transform: 'translateY(-100px)'
      })),
      transition('shown => hidden', [
        animate('0.5s')
      ]),
      transition('hidden => shown', [
        animate('0.5s')
      ])
    ])
  ],
  templateUrl: './historia-medica.component.html',
  styleUrl: './historia-medica.component.css'
})
export class HistoriaMedicaComponent implements OnInit{

  historiasMedicas: any[] = [];
  historiasMedicasAux: any[] = [];
  pacientes: any[] = [];
  especialistas: any[] = [];
  pacienteElegido?: any;
  onSpinner: boolean = true;
  flag: number = 0;

  constructor(
    private firestore: Firestore,
    public userService: UsuarioService
  ){}

  ngOnInit(): void {
    if (this.userService.usuarioLogeado.user == 'paciente') {
      const qEspecialistas = query(collection(this.firestore, "historiaMedica"), orderBy('fecha', 'desc'));
      onSnapshot(qEspecialistas, (snapshot: QuerySnapshot) => {
        snapshot.forEach((doc: QueryDocumentSnapshot) => {
          if (doc.data()['paciente'].mail == this.userService.usuarioLogeado.mail) {
            const historiaMedica: any = doc.data();
            historiaMedica.ref = doc.ref;
            historiaMedica.verTurno = false;
            historiaMedica.fecha = historiaMedica.fecha.toDate();
            this.historiasMedicas.push(historiaMedica);
            this.historiasMedicasAux.push(historiaMedica);
            let cont = 0;
            this.especialistas.forEach((especialista: any) =>{
              if (especialista.dni == historiaMedica.especialista.dni)
                cont++;
            });
            if(cont == 0)
              this.especialistas.push(historiaMedica.especialista);
          }
        });
        this.onSpinner = false;
      });
    }
    if (this.userService.usuarioLogeado.user == 'especialista') {
      const qEspecialistas = query(collection(this.firestore, "historiaMedica"), orderBy('fecha', 'desc'));
      onSnapshot(qEspecialistas, (snapshot: QuerySnapshot) => {
        snapshot.forEach((doc: QueryDocumentSnapshot) => {
          if (doc.data()['especialista'].mail == this.userService.usuarioLogeado.mail) {
            const historiaMedica: any = doc.data();
            historiaMedica.ref = doc.ref;
            historiaMedica.fecha = historiaMedica.fecha.toDate();
            this.historiasMedicas.push(historiaMedica);
            this.historiasMedicasAux.push(historiaMedica);
            let cont = 0;
            this.pacientes.forEach((paciente: any) =>{
              if (paciente.dni == historiaMedica.paciente.dni)
                cont++;
            });
            if(cont == 0)
              this.pacientes.push(historiaMedica.paciente);
          }
        });
        this.onSpinner = false;
      });
    }

    if (this.userService.usuarioLogeado.user == 'admin') {
      const qEspecialistas = query(collection(this.firestore, "historiaMedica"), orderBy('fecha', 'desc'));
      onSnapshot(qEspecialistas, (snapshot: QuerySnapshot) => {
        snapshot.forEach((doc: QueryDocumentSnapshot) => {
          if (JSON.parse(localStorage.getItem('user')!) == 'paciente') {
            if (doc.data()['paciente'].mail == JSON.parse(localStorage.getItem('emailUsuario')!)) {
              const historiaMedica: any = doc.data();
              historiaMedica.ref = doc.ref;
              historiaMedica.fecha = historiaMedica.fecha.toDate();
              this.historiasMedicas.push(historiaMedica);
              this.historiasMedicasAux.push(historiaMedica);
            }
          }else{
            if (doc.data()['especialista'].mail == JSON.parse(localStorage.getItem('emailUsuario')!)) {
              const historiaMedica: any = doc.data();
              historiaMedica.ref = doc.ref;
              historiaMedica.fecha = historiaMedica.fecha.toDate();
              this.historiasMedicas.push(historiaMedica);
              this.historiasMedicasAux.push(historiaMedica);
            }
          }
        });
        this.onSpinner = false;
      });
    }
  }

  async verTurno(historiaMedica: any){
    const docRef = doc(this.firestore, "turnos", historiaMedica.turno);
    const docSnap = await getDoc(docRef);
    historiaMedica.verTurno = docSnap.data();
    historiaMedica.verTurno.fecha = historiaMedica.verTurno.fecha.toDate();
  }

  onChangePaciente(paciente: any){
    this.historiasMedicasAux = []
    if (this.flag == 0 || this.pacienteElegido.dni != paciente.dni) {
      this.pacienteElegido = paciente;
      this.historiasMedicas.forEach((historia: any) =>{
        if(historia.paciente.dni == paciente.dni)
          this.historiasMedicasAux.push(historia);
      });
      this.flag = 1;
    }else{
      this.pacienteElegido = undefined;
      this.historiasMedicas.forEach((historia: any) =>{
        this.historiasMedicasAux.push(historia);
      });
      this.flag = 0;
    }
  }
  
  async descargarTodasLasHistorias(){
    this.onSpinner = true;
    const logoDataUrl = await this.convertToDataURLviaCanvas('../../../assets/logo.png', 'image/png');
    const fecha = new Date();
    const pdfContent: any[] = [];
    pdfContent.push(
      {
        image: logoDataUrl,
        width: 70
      },
      {
        text: 'Fecha: ' + fecha.getDate() + '/' + fecha.getMonth() + '/' + fecha.getFullYear(),
        fontSize: 20
      },
      {
        text: '\n\n Historias medicas de ' + this.userService.usuarioLogeado.apellido + ', ' + this.userService.usuarioLogeado.nombre,
        fontSize: 20,
        style: 'header',
        aligment: 'center'
      }
    )
    this.historiasMedicas.forEach(async (historia: any) => {
        const docRef = doc(this.firestore, "turnos", historia.turno);
        const docSnap = await getDoc(docRef);
        historia.turno = docSnap.data();
        pdfContent.push(
          {text: '\n\n' + historia.fecha.getDate() + '/' + historia.fecha.getMonth() + '/' + historia.fecha.getFullYear(), style: 'header'},
          {
            ul: [
              'Hora: ' + historia.turno.hora,
              'Reseña: ' + historia.turno.resenia,
              'Especialidad: ' + historia.turno.especialidad,
              'Altura: ' + historia.altura,
              'Peso: ' + historia.peso,
              'Temperatura: ' + historia.temperatura,
              'Presion: ' + historia.presion,
              historia.clave1 ? historia.clave1 + ': ' + historia.valor1 : '',
              historia.clave2 ? historia.clave2 + ': ' + historia.valor2 : '',
              historia.clave3 ? historia.clave3 + ': ' + historia.valor3 : '',
            ]
          }
        )
    });
    setTimeout(() =>{
      const dd = {
        content: pdfContent
      }
      const pdf = pdfMake.createPdf(dd);
      pdf.download('historiasMedicas' + this.userService.usuarioLogeado.apellido + this.userService.usuarioLogeado.nombre + '.pdf');
      this.onSpinner = false;
    }, 1000);
  }

  async descargarPdfPorEspecialista(especialista: any){
    this.onSpinner = true;
    const logoDataUrl = await this.convertToDataURLviaCanvas('../../../assets/logo.png', 'image/png');
    const fecha = new Date();
    const pdfContent: any[] = [];
    pdfContent.push(
      {
        image: logoDataUrl,
        width: 70
      },
      {
        text: 'Fecha: ' + fecha.getDate() + '/' + fecha.getMonth() + '/' + fecha.getFullYear(),
        fontSize: 20
      },
      {
        text: '\n\n Turnos con el especialista: ' + especialista.apellido + ', ' + especialista.nombre,
        fontSize: 20,
        style: 'header',
        aligment: 'center'
      }
    )
    this.historiasMedicas.forEach(async (historia: any) => {
      if (historia.especialista.dni == especialista.dni) {
        const docRef = doc(this.firestore, "turnos", historia.turno);
        const docSnap = await getDoc(docRef);
        historia.turno = docSnap.data();
        pdfContent.push(
          {text: '\n\n' + historia.fecha.getDate() + '/' + historia.fecha.getMonth() + '/' + historia.fecha.getFullYear(), style: 'header'},
          {
            ul: [
              'Hora: ' + historia.turno.hora,
              'Reseña: ' + historia.turno.resenia,
              'Especialidad: ' + historia.turno.especialidad,
              'Altura: ' + historia.altura,
              'Peso: ' + historia.peso,
              'Temperatura: ' + historia.temperatura,
              'Presion: ' + historia.presion,
              historia.clave1 ? historia.clave1 + ': ' + historia.valor1 : '',
              historia.clave2 ? historia.clave2 + ': ' + historia.valor2 : '',
              historia.clave3 ? historia.clave3 + ': ' + historia.valor3 : '',
            ]
          }
        )
      }
    });
    setTimeout(() =>{
      const dd = {
        content: pdfContent
      }
      const pdf = pdfMake.createPdf(dd);
      pdf.download('turnos' + especialista.apellido + especialista.nombre + '.pdf');
      this.onSpinner = false;
    }, 1000);
  }

  convertToDataURLviaCanvas(url: string, outputFormat: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.height = img.height;
        canvas.width = img.width;
        ctx?.drawImage(img, 0, 0, img.width, img.height);
        const dataURL = canvas.toDataURL(outputFormat);
        resolve(dataURL);
      };
      img.onerror = error => reject(error);
      img.src = url;
    });
  }
}