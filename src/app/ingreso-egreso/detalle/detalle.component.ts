import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import Swal from 'sweetalert2';
import { IngresoEgreso } from '../../models/ingreso-egreso.model';
import { IngresoEgresoService } from '../../services/ingreso-egreso.service';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: []
})
export class DetalleComponent implements OnInit, OnDestroy {

  ingresosEgresos: IngresoEgreso[] = [];
  ingresosSubs: Subscription;

  constructor(private store: Store<AppState>, private ingresoServices: IngresoEgresoService) { }
  
  ngOnInit() {
    
    this.ingresosSubs = this.store.select('ingresosEgresos')
      .subscribe( ({items}) => {
        //console.log(items);
        this.ingresosEgresos = items;
      });
      
    }
    
  ngOnDestroy(){
    this.ingresosSubs.unsubscribe();
  }


  borrar(item: IngresoEgreso){
    //console.log(item.id);
    this.ingresoServices.borrarIngresoEgreso(item.uid)
      .then(  () => Swal.fire('Borrado', item.descripcion, 'success') )
      .catch( err => Swal.fire('Error', err.message, 'error') );
    
  }

}
