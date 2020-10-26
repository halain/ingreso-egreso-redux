import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public auth: AngularFireAuth, private firestore: AngularFirestore) { }

  //metodo para obtener info cuando hay cambios en la autenticacion del usuario
  initAuthListener(){
    this.auth.authState
     .subscribe( (fbuser)=> {
       console.log(fbuser);
       
     })
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
