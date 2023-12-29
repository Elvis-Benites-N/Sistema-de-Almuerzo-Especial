import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Meta, MetaDefinition, Title } from '@angular/platform-browser';
import { ActivationEnd, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs/internal/operators/filter';
import { map } from 'rxjs/internal/operators/map';
import { Subscription } from 'rxjs/internal/Subscription';
import { fadeIn } from './app.route-animation';
import { DataRoute } from './core/interfaces/custom-route.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [fadeIn],
})
export class AppComponent implements OnInit, OnDestroy {

  public cargandoRuta = true;

  private suscripciones: Subscription[];

  constructor(
    private readonly router: Router,
    private readonly title: Title,
    private readonly meta: Meta,
    private readonly cdRef: ChangeDetectorRef,
  ) {
    this.suscripciones = [];
    this.suscripciones.push(
      this.router.events
        .pipe(
          filter((evento) => evento instanceof ActivationEnd),
          filter((evento: any) => evento.snapshot.firstChild === null),
          map((evento: ActivationEnd) => evento.snapshot.data)
        )
        .subscribe((data: DataRoute) => {
          const titleText = data.webtitle ?? 'Sistema';
          const descriptionText = data.webdescription ?? 'Sistema';

          const metaTag: MetaDefinition = {
            name: 'description',
            content: descriptionText,
          };

          this.title.setTitle(titleText);
          this.meta.updateTag(metaTag);
        }));
    this.suscripciones.push(
      this.router.events
        .pipe(filter((evento) => evento instanceof NavigationStart))
        .subscribe((value) => (this.cargandoRuta = true)));
    this.suscripciones.push(
      this.router.events
        .pipe(filter((evento) => evento instanceof NavigationEnd))
        .subscribe((value) => {
          this.cargandoRuta = false;
        }));
  }

  ngOnInit(): void {

  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  ngOnDestroy(): void {
    this.suscripciones.forEach(e => e?.unsubscribe());
  }
}
