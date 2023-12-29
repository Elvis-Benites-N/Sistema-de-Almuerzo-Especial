import {
    AbstractControl,
    FormArray,
    FormGroup
} from '@angular/forms';

export namespace FormUtil {
  export function isInvalidForm<
    TControl extends {
      [K in keyof TControl]: AbstractControl<any, any>;
    } = any
  >(formulario: FormGroup<TControl>): boolean {
    if (formulario.invalid) {
      Object.values(formulario.controls).forEach((control) => {
        if (control instanceof FormArray) {
          control.controls.forEach((fg) => {
            isInvalidForm(fg as FormGroup);
          });
          return;
        }

        if (control instanceof FormGroup) {
          isInvalidForm(control);
          return;
        }

        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return true;
    }

    return false;
  }

  export function getErrorMessage(
    FC: AbstractControl,
    etiqueta: string
  ): string {
    if (!FC.errors) return null;

    if (FC.errors['required']) return `El campo ${etiqueta} es requerido`;

    if (FC.errors['minlength'])
      return `Debe ingresar mínimo ${FC.errors['minlength']['requiredLength']} caracteres`;

    if (FC.errors['maxlength'])
      return `Máximo puede ingresar ${FC.errors['maxlength']['requiredLength']} caracteres`;

    return '';
  }

  export function markAsError(FC: AbstractControl): void {
    FC.markAsDirty();
    FC.updateValueAndValidity({ onlySelf: true });
  }
}
