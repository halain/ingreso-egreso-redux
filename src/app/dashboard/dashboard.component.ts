import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AppState } from '../app.reducer';
import * as ingresoEgresoActions from '../ingreso-egreso/ingreso-egreso.actions';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: []
})
export class DashboardComponent implements OnInit, OnDestroy {

  authSubscription: Subscription;
  ingresoSubscription: Subscription;

  constructor(private store: Store<AppState>, private ingresosEgresosServices: IngresoEgresoService) { }

  ngOnInit() {

    this.authSubscription = this.store.select('user').pipe(
      filter( auth => auth.user != null ) //solo subscribirse cuando el user != null
    )
      .subscribe( ({user}) => {
        console.log(user);
        this.ingresoSubscription = this.ingresosEgresosServices.initIngresosEgresosListener(user.uid)
          .subscribe( ingresosEgresosFB =>{
             //console.log(ingresosEgresosFB);
            this.store.dispatch( ingresoEgresoActions.setItems({items: ingresosEgresosFB}));
          })
      } )

  }


  ngOnDestroy() {

    this.ingresoSubscription.unsubscribe();
    this.authSubscription.unsubscribe();
   
  }



}
