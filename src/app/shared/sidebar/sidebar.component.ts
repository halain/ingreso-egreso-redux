import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { Usuario } from '../../models/usuario.model';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit, OnDestroy {

  userSubs: Subscription

  nombre: string = '';

  constructor(private authServices: AuthService, private router: Router, private store: Store<AppState>) { }

  ngOnInit() {
    
    this.userSubs = this.store.select('user')
      .pipe( 
        filter( ({user}) => user != null )
        )
        .subscribe( ({user}) => this.nombre = user.nombre);

    }

  ngOnDestroy() {
    this.userSubs.unsubscribe();
  }  

  logout(){
      this.authServices.logout()
      .then( () => {
        this.router.navigate(['login']);
      });
  }

}
