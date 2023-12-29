import { FormControl, FormGroup, Validators } from "@angular/forms";
import { FormWrapper } from "src/app/core/classes/form-wrapper.class";
import { ObtenerTrabajadorRRHHRequest } from "src/app/core/controllers/services/business/dto/busqueda/busqueda-trabajador.dto";

export class BusquedaTrabajadorForm extends FormWrapper<
    ObtenerTrabajadorRRHHRequest, {
        idTipoBusqueda: FormControl<number>;
        palabraClave: FormControl<string>;
    }>{

    public async toRequest(): Promise<ObtenerTrabajadorRRHHRequest> {
        const f = this.formulario.getRawValue();

        return {
            idTipoBusqueda: f.idTipoBusqueda,
            numeroDocumento: f.palabraClave,
        }
    }

    protected inicializarFormulario(): void {
        this.formulario = new FormGroup({
            idTipoBusqueda: new FormControl<number>(1, [
                Validators.required,
                Validators.min(1),
            ]),
            palabraClave: new FormControl<string>(null, [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(15),
            ]),
        });
    }

    protected extraValidation(): boolean {
        return true;
    }

    protected deshabilitarCampos(): void {
    }

}