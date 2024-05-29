export class Paciente{
    nombre: string;
    apellido: string;
    edad: number;
    dni: string;
    obraSocial: string;
    mail: string;
    password: string;
    imgs: string[];

    constructor(nombreCompleto: { nombre: string; apellido: string }, edad: number, dni: string, obraSocial: string, 
        mail: string, password: string,imgs: string[]) {
        this.nombre = nombreCompleto.nombre;
        this.apellido = nombreCompleto.apellido;
        this.edad = edad;
        this.dni = dni;
        this.obraSocial = obraSocial;
        this.mail = mail;
        this.password = password;
        this.imgs = imgs;
    }
}