import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { FormUtil } from '../utils/form.util';

export abstract class FormWrapper<
  IRequest = any,
  IForm extends {
    [K in keyof IForm]: AbstractControl<any>;
  } = any
> {
  public formulario: FormGroup<IForm>;

  public enviandoFormulario: boolean;
  public hasErrorFromAPI: boolean;
  public errorMessageFromAPI: string;
  public submitted: boolean;

  constructor() {
    this.submitted = false;
    this.enviandoFormulario = false;
    this.hasErrorFromAPI = false;
    this.inicializarFormulario();
    this.deshabilitarCampos();
  }

  public abstract toRequest(): Promise<IRequest>;
  protected abstract inicializarFormulario(): void;
  protected abstract extraValidation(): boolean;
  protected abstract deshabilitarCampos(): void;

  public getErrorMessage(atributo: string, etiqueta?: string): string {
    return FormUtil.getErrorMessage(
      this.formulario.get(atributo),
      etiqueta ?? atributo
    );
  }

  markAsError(atributo: string, error?: string) {
    FormUtil.markAsError(this.formulario.get(atributo));
    this.hasErrorFromAPI =
      error !== null && error !== undefined && error !== '';
    this.errorMessageFromAPI = error;
  }

  public validate(): boolean {
    this.submitted = true;

    return !FormUtil.isInvalidForm(this.formulario) && this.extraValidation();
  }

  public deshabilitar(): void {
    this.enviandoFormulario = true;
    this.hasErrorFromAPI = false;
    this.errorMessageFromAPI = null;
    this.formulario.disable({ emitEvent: false });
  }

  public habilitar(): void {
    this.enviandoFormulario = false;
    this.formulario.enable({ emitEvent: false });
    this.deshabilitarCampos();
  }

  public resetear(): void {
    this.submitted = false;
    this.enviandoFormulario = false;
    this.hasErrorFromAPI = false;
    this.errorMessageFromAPI = null;
    this.formulario.reset();
    Object.values(this.formulario.controls).forEach((control) => {
      if (control instanceof FormArray) {
        control.clear();
      }
    });
    this.deshabilitarCampos();
  }

}
