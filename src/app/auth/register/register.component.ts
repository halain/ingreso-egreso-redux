import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import * as uiActions from 'src/app/shared/ui.actions';

import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: []
})
export class RegisterComponent implements OnInit, OnDestroy {

  registroForm: FormGroup;
  cargando: boolean = false;
  uiSubscription: Subscription;


  constructor(private fb: FormBuilder, 
              private _authServices: AuthService, 
              private router: Router,
              private store: Store<AppState>) {
    
   }

  ngOnInit() {

    this.registroForm = this.fb.group({
      nombre: ['',Validators.required],
      correo: ['', [Validators.required, Validators.email] ],
      password: ['',Validators.required],
    });

    this.uiSubscription = this.store.select('ui').subscribe( ui => this.cargando = ui.isLoading);

  }

  
  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }



  crearUsuario(){
    if (this.registroForm.invalid) return;

    this.store.dispatch( uiActions.isLoading());
    
    const {nombre, correo, password} = this.registroForm.value;

    // Swal.fire({
    //   title: 'Espere ... !',
    //   willOpen: () => {
    //     Swal.showLoading()
    //   },
    // });

    this._authServices.cearUsuario(nombre, correo, password)
      .then(credenciales => {
        // Swal.close();
         //console.log(credenciales);
         this.store.dispatch( uiActions.stopLoading());
        this.router.navigate(['/']);
      })
      .catch( err => {
        this.store.dispatch( uiActions.stopLoading());
         //console.error(err) 
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.message,
        })
      });
      
  }


}
