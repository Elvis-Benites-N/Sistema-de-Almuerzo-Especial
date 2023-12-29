import { Component, Inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NzButtonModule} from 'ng-zorro-antd/button';
import { NzGridModule} from 'ng-zorro-antd/grid';
import { NzModalModule} from 'ng-zorro-antd/modal';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { APP_CONFIG, Config } from 'src/app/core/config/config';

@Component({
  selector: 'modal-confirmacion',
  standalone: true,
  imports: [
    CommonModule,
    NzButtonModule,
    NzGridModule,
    NzModalModule,
    NzSpaceModule,
    NzTypographyModule,
  ],
  templateUrl: './modal-confirmacion.component.html',
  styleUrls: ['./modal-confirmacion.component.scss']
})
export class ModalConfirmacionComponent implements OnInit {

  @Input()
  isVisible: boolean;

  @Input()
  handleCancel: Function;

  constructor(
    @Inject(APP_CONFIG)
    public readonly config: Config
  ) { }

  ngOnInit(): void {
  }

}
