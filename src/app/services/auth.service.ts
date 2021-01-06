import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as authActions from '../auth/auth.actions';
import * as ingresoActions from '../ingreso-egreso/ingreso-egreso.actions';

import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSubscription: Subscription;
  private _user: Usuario;

  
  public get getUser() : Usuario {
    return this._user;
  }
  

  constructor(public auth: AngularFireAuth, private firestore: AngularFirestore, private store: Store<AppState>) { }

  //metodo para obtener info cuando hay cambios en la autenticacion del usuario
  initAuthListener(){
    this.auth.authState.subscribe( (fbuser)=> {
      
      if (fbuser){//existe
        this.userSubscription =  this.firestore.doc(`${fbuser.uid}/usuario`).valueChanges().subscribe( (firestoreUser: any) => {
                                    const user = Usuario.fromFirebase(firestoreUser);
                                    this._user = user;                                    
                                    this.store.dispatch( authActions.setUser( {user} ));
                                  });
      }else { //no existe
        this._user = null;
        this.store.dispatch( authActions.unSetUser() );
        this.store.dispatch( ingresoActions.unSetItems() );
        if (this.userSubscription){
          this.userSubscription.unsubscribe();
        }
      }

     });
  }

  cearUsuario(nombre: string, email: string, password: string){
    //registrar nuevo usuario
   return this.auth.createUserWithEmailAndPassword(email, password)
            // .then(fbUser => {
              // const newUser = new Usuario(fbUser.user.uid, nombre, email);
            .then( ({user}) => {
              const newUser = new Usuario(user.uid, nombre, user.email);
              return this.firestore.doc(`${user.uid}/usuario`).set({...newUser});
            })
  }

  loginUsuario(email: string, password: string){
   return this.auth.signInWithEmailAndPassword(email, password);
  }

  logout(){
    return this.auth.signOut();
  }

  isAuth(){
    return this.auth.authState.pipe( 
      map( fbuser => fbuser != null )
    );
  }

}
