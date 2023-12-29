import { CommonModule } from '@angular/common';
import { Component, HostListener, Input, OnInit } from '@angular/core';

@Component({
  selector: 'navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  @Input()
  backgroundColor = 'white';

  @Input()
  isWhite? = false;

  @Input()
  useBackdropFilter? = false;

  public seMuestraSombra = false;


  constructor() { }

  ngOnInit(): void {
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: any) {
    this.seMuestraSombra = window.pageYOffset > 0;
  }

}
