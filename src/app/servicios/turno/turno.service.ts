import { Injectable } from '@angular/core';
import { DocumentData, DocumentReference, Firestore, addDoc, collection, updateDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class TurnoService {

  constructor(
    private firestore: Firestore
  ) { }

  async updateHorario(horario: any, ref: DocumentReference<DocumentData, DocumentData>): Promise<boolean> {
    try {
        await updateDoc(ref, horario);
        return true;
    } catch (error) {
        console.error("Error al actualizar usuario:", error);
        return false;
    }
  }

  async generarHorariosSemana(especialista: any, especialidad: string){
    await Promise.all([
      this.agregarHorarioDia("Lunes", especialista, especialidad),
      this.agregarHorarioDia("Martes", especialista, especialidad),
      this.agregarHorarioDia("Miercoles", especialista, especialidad),
      this.agregarHorarioDia("Jueves", especialista, especialidad),
      this.agregarHorarioDia("Viernes", especialista, especialidad),
      this.agregarHorarioDia("Sabado", especialista, especialidad)
    ]);
  }

  async agregarHorarioDia(dia: string, especialista: any, especialidad: string) {
    const horario = this.generarHorariosDia(especialista, dia, especialidad);
    const col = collection(this.firestore, 'horarios');
    return addDoc(col, horario);
  }

  generarHorariosDia(especialista: any, dia: string, especialidad: string) {
    const horario = {
      dia: dia,
      hora: this.generarHoras(),
      disponibilidad: this.generarDisponibilidad(),
      especialista: `${especialista.nombre}, ${especialista.apellido}`,
      mail: especialista.mail.toLowerCase(),
      especialidad: especialidad,
    };
    return horario;
  }

  generarHoras() {
    return [
      "9:00",
      "9:30",
      "10:00",
      "10:30",
      "11:00",
      "11:30",
      "12:00",
      "12:30",
      "13:00",
      "13:30",
      "14:00",
      "14:30",
      "15:00",
      "15:30",
      "16:00",
      "16:30",
      "17:00",
      "17:30"
    ];
  }

  generarDisponibilidad(): boolean[]{
    return [
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false
    ]
  }
}
