import { ValidatorFn, ValidationErrors, AbstractControl } from "@angular/forms";

export function repetirClaveValidator(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
        
      const clave = formGroup.get('password');
      const repiteClave = formGroup.get('repetirPassword');
      const respuestaError = { noCoincide: 'La clave no coincide' };

      if (clave?.value != repiteClave?.value) {
        formGroup.get('repetirPassword')?.setErrors(respuestaError);
        // Si los campos de contraseña no coinciden, devolvemos un error de validación
        return respuestaError;

      } else {
        formGroup.get('repetirPassword')?.setErrors(null);
        // Si los campos de contraseña coinciden, la validación es correcta
        return null;
      }
    };
}