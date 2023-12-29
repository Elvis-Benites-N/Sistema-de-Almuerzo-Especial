import { CommonModule } from '@angular/common';
import { Component, HostListener, Inject, OnInit } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { APP_CONFIG, Config } from 'src/app/core/config/config';
import { ENDPOINTS } from 'src/app/core/constants/endpoints.constant';
import { BusinessService } from 'src/app/core/controllers/services/business/business.service';
import { ObtenerTrabajadorRRHHRequest, ObtenerTrabajadorRRHHResponse } from 'src/app/core/controllers/services/business/dto/busqueda/busqueda-trabajador.dto';
import { ResponseAPI } from 'src/app/core/interfaces/response-api.interface';
import { ErrorUtil } from 'src/app/core/utils/error.util';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { BusquedaTrabajadorForm } from './busqueda-trabajador.form';
import { ModalConfirmacionComponent } from './modal-confirmacion/modal-confirmacion.component';
import { RegistroTrabajadorForm } from './registro-trabajador.form';

enum AlmuerzoEspecialPageState {
  SinBusqueda,
  ConResultado,
}


@Component({
  selector: 'almuerzo-especial',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzAlertModule,
    NzSelectModule,
    NzButtonModule,
    NzInputModule,
    NzGridModule,
    NzSpaceModule,
    NzFormModule,
    NzTypographyModule,
    NzTagModule,
    ModalConfirmacionComponent,
    NavbarComponent,
  ],
  templateUrl: './almuerzo-especial.component.html',
  styleUrls: ['./almuerzo-especial.component.scss']
})
export class AlmuerzoEspecialPage implements OnInit {
  public EstadosType = AlmuerzoEspecialPageState;

  public estado: AlmuerzoEspecialPageState;
  public trabajadorRRHHResponse: ObtenerTrabajadorRRHHResponse;

  public busquedaTrabajadorForm: BusquedaTrabajadorForm;
  public registroTrabajadorForm: RegistroTrabajadorForm;

  public estaAbiertoModalConfirmacion = false;

  constructor(
    @Inject(APP_CONFIG)
    public readonly config: Config,
    private readonly businessService: BusinessService,
    private readonly modal: NzModalService,
  ) {
    this.estado = AlmuerzoEspecialPageState.SinBusqueda;
    this.busquedaTrabajadorForm = new BusquedaTrabajadorForm();
    this.registroTrabajadorForm = new RegistroTrabajadorForm();
  }

  ngOnInit(): void {
  }

  async buscarTrabajador() {
    if (this.busquedaTrabajadorForm.enviandoFormulario) return;

    if (!this.busquedaTrabajadorForm.validate()) {
      return;
    }

    try {
      this.busquedaTrabajadorForm.deshabilitar();

      const busquedaTrabajadorRequest = await this.busquedaTrabajadorForm.toRequest();

      this.estado = AlmuerzoEspecialPageState.SinBusqueda;
      this.trabajadorRRHHResponse = null;
      this.trabajadorRRHHResponse = await this.businessService.methodGet<
        ObtenerTrabajadorRRHHResponse,
        ObtenerTrabajadorRRHHRequest>(
          ENDPOINTS.almuerzoEspecial, busquedaTrabajadorRequest);

      this.estado = AlmuerzoEspecialPageState.ConResultado;
      this.registroTrabajadorForm.patchFormulario(
        this.trabajadorRRHHResponse.trabajador,
        busquedaTrabajadorRequest.idTipoBusqueda,
      );
      this.busquedaTrabajadorForm.resetear();
      this.busquedaTrabajadorForm.formulario.patchValue({
        idTipoBusqueda: 1,
      });
      setTimeout(() => {
        window.scrollTo({
          top: window.innerHeight,
          left: 0,
          behavior: 'smooth',
        });
      });
    } catch (error) {
      const message = ErrorUtil.getApiErrorMessage(error);
      if (message === 'Trabajador no encontrado') {
        this.modal.error({
          nzTitle: 'Lo sentimos',
          nzContent: 'No se encontraron resultados con ' +
            `<b>${this.busquedaTrabajadorForm.formulario.getRawValue().idTipoBusqueda === 1 ? 'DNI:' : 'CÓD. TRABAJADOR'}` +
            ` ${this.busquedaTrabajadorForm.formulario.getRawValue().palabraClave}</b>`,
          nzCentered: true,
        });
      } else {
        this.modal.error({
          nzTitle: ':(',
          nzContent: message,
          nzCentered: true,
        });

      }
    } finally {
      this.busquedaTrabajadorForm.habilitar();
    }

  }

  async registrarTrabajador() {
    if (this.registroTrabajadorForm.enviandoFormulario) return;

    if (!this.registroTrabajadorForm.validate()) {
      return;
    }

    try {
      this.registroTrabajadorForm.deshabilitar();
      this.busquedaTrabajadorForm.deshabilitar();

      const request = await this.registroTrabajadorForm.toRequest();

      await this.businessService.methodPost<ResponseAPI, ObtenerTrabajadorRRHHRequest>(
        ENDPOINTS.almuerzoEspecial, request);

      this.estado = AlmuerzoEspecialPageState.SinBusqueda;
      this.registroTrabajadorForm.resetear();
      setTimeout(() => {
        this.abrirModalConfirmacion();
      });
    } catch (error) {
      this.modal.error({
        nzTitle: 'Algo salió mal',
        nzContent: ErrorUtil.getApiErrorMessage(error),
        nzCentered: true,
      });
    } finally {
      this.busquedaTrabajadorForm.habilitar();
      this.registroTrabajadorForm.habilitar();
    }
  }

  abrirModalConfirmacion() {
    this.estaAbiertoModalConfirmacion = true;
  }

  cerrarModalConfirmacion = (): void => {
    this.estaAbiertoModalConfirmacion = false;
  }

}
