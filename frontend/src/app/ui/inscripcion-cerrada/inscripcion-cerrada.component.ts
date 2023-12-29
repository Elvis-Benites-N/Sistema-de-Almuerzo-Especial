import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { APP_CONFIG, Config } from 'src/app/core/config/config';
import { NavbarComponent } from '../shared/navbar/navbar.component';

@Component({
  selector: 'app-inscripcion-cerrada',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    NzTypographyModule,
  ],
  templateUrl: './inscripcion-cerrada.component.html',
  styleUrls: ['./inscripcion-cerrada.component.scss']
})
export class InscripcionCerradaPage implements OnInit {

  constructor(
    @Inject(APP_CONFIG)
    public readonly config: Config,
  ) { }

  ngOnInit(): void {
  }

}
