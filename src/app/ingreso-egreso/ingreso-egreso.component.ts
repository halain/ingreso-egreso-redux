import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { AppState } from '../app.reducer';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import * as ui from '../shared/ui.actions';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: []
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {

  ingresoForm: FormGroup;
  tipo: string = 'ingreso';
  cargando: boolean = false;
  uiSubscription: Subscription;



  constructor(private fb: FormBuilder, private ingresoEgresoServices: IngresoEgresoService, private store: Store<AppState>) { }
 


  ngOnInit() {

    this.ingresoForm = this.fb.group({
      descripcion: ['', Validators.required],
      monto: ['', Validators.required],
    });

    this.uiSubscription = this.store.select('ui').subscribe( ({isLoading}) => this.cargando = isLoading);
  }



  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }




  guardar(){

    if (this.ingresoForm.invalid)
      return;

    this.store.dispatch( ui.isLoading() );

     const {descripcion, monto } = this.ingresoForm.value;
    // console.log(this.tipo);

    const ingresoEgreso = new IngresoEgreso(descripcion, monto, this.tipo);

    this.ingresoEgresoServices.crearIngresoEgreso(ingresoEgreso)
      .then( () => {
        this.store.dispatch( ui.stopLoading() );
        this.ingresoForm.reset();
        Swal.fire('Registor creado', descripcion, 'success');
      })
      .catch( err => {
        this.store.dispatch( ui.stopLoading() );
        Swal.fire('Error', err.message, 'error');
      });
    
    
  }

}
