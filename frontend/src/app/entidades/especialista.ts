export class Especialista{
    nombre: string;
    apellido: string;
    edad: number;
    dni: string;
    especialidad: string[];
    mail: string;
    password: string;
    img: string;

    constructor(nombreCompleto: { nombre: string; apellido: string }, edad: number, dni: string, especialidad: string[], 
        mail: string, password: string,img: string) {
        this.nombre = nombreCompleto.nombre;
        this.apellido = nombreCompleto.apellido;
        this.edad = edad;
        this.dni = dni;
        this.especialidad = especialidad;
        this.mail = mail;
        this.password = password;
        this.img = img;
    }
}