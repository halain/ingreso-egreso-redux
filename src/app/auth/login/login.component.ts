import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private _authServices: AuthService, private router: Router) { }

  ngOnInit() {
    
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email] ],
      password: ['',Validators.required],
    })
  }

  login(){
    
    if (this.loginForm.invalid) return;

    const {email, password} = this.loginForm.value;

    Swal.fire({
      title: 'Espere ... !',
      willOpen: () => {
        Swal.showLoading()
      },
    });

    this._authServices.loginUsuario(email, password)
    .then(credenciales => {
      Swal.close();
       //console.log(credenciales);
      this.router.navigate(['/']);
    })
    .catch( err => {
      //console.error(err) 
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.message,
      })
    })

  }

}
