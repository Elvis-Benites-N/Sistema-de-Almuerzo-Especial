import { FormControl, FormGroup, Validators } from "@angular/forms";
import { FormWrapper } from "src/app/core/classes/form-wrapper.class";
import { ObtenerTrabajadorRRHHRequest, TrabajadorResponse } from "src/app/core/controllers/services/business/dto/busqueda/busqueda-trabajador.dto";

export class RegistroTrabajadorForm extends FormWrapper<
    ObtenerTrabajadorRRHHRequest, {
        numeroDocumento: FormControl<string>;
        idTipoBusqueda: FormControl<number>;
    }>{

    public async toRequest(): Promise<ObtenerTrabajadorRRHHRequest> {
        const f = this.formulario.getRawValue();

        return {
            idTipoBusqueda: f.idTipoBusqueda,
            numeroDocumento: f.numeroDocumento,
        }
    }

    protected inicializarFormulario(): void {
        this.formulario = new FormGroup({
            idTipoBusqueda: new FormControl<number>(null, [
                Validators.required,
            ]),
            numeroDocumento: new FormControl<string>(null, [
                Validators.required,
            ]),
        });
    }

    protected extraValidation(): boolean {
        return true;
    }

    protected deshabilitarCampos(): void {
    }

    public patchFormulario(data: TrabajadorResponse, tipoBusqueda: number): void {
        this.formulario.patchValue({
            idTipoBusqueda: tipoBusqueda,
            numeroDocumento: data.dni,
        });
    }

}