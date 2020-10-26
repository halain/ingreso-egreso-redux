import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import * as uiActions from '../../shared/ui.actions';

import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  cargando: boolean = false;
  uiSubscription: Subscription;

  constructor(private fb: FormBuilder, 
              private _authServices: AuthService, 
              private router: Router,
              private store: Store<AppState>) { }
 
 
  ngOnInit() {
    
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email] ],
      password: ['',Validators.required],
    });

    this.uiSubscription = this.store.select('ui').subscribe( ui => {
                            this.cargando = ui.isLoading;
                          });

  }


  
  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }



  login(){
    
    if (this.loginForm.invalid) return;

    this.store.dispatch( uiActions.isLoading());

    const {email, password} = this.loginForm.value;

    // Swal.fire({
    //   title: 'Espere ... !',
    //   willOpen: () => {
    //     Swal.showLoading()
    //   },
    // });

    this._authServices.loginUsuario(email, password)
    .then(credenciales => {
      // Swal.close();
      this.store.dispatch( uiActions.stopLoading());
       //console.log(credenciales);
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
    })

  }

}
