export class Administrador{
    nombre: string;
    apellido: string;
    edad: number;
    dni: string;
    mail: string;
    password: string;
    img: string;

    constructor(nombreCompleto: { nombre: string; apellido: string }, edad: number, dni: string, 
        mail: string, password: string,img: string) {
        this.nombre = nombreCompleto.nombre;
        this.apellido = nombreCompleto.apellido;
        this.edad = edad;
        this.dni = dni;
        this.mail = mail;
        this.password = password;
        this.img = img;
    }
}