import { Injectable } from '@angular/core';
import 'firebase/firestore';
import { AngularFirestore } from '@angular/fire/firestore';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {

  constructor(private firestore: AngularFirestore, private authServices: AuthService) { }

  crearIngresoEgreso(ingresoEgreso: IngresoEgreso){
      //ingresar en una coleccion de firebase
    const uid = this.authServices.getUser.uid;

    delete ingresoEgreso.uid;

    return this.firestore.doc(`${uid}/ingreso-egreso`)
      .collection('items')
      .add({ ...ingresoEgreso });
  }

  
  //regresar coleccion de ingresos-egresos en dependencia del usuario logeado
  initIngresosEgresosListener(uid: string){

      //obtener informacion de firestore
      return this.firestore.collection(`${uid}/ingreso-egreso/items`)
              //.valueChanges()
              //.subscribe()
              .snapshotChanges() //para poder obtener el id de cada item 
              .pipe(
                map( snapshop => { //map de rxjs
                  //console.log(snapshop);
                  return snapshop.map( doc => { //metodo map() de los arreglos
                    // const data: any = doc.payload.doc.data();
                    return {
                      uid: doc.payload.doc.id,
                      ...doc.payload.doc.data() as any //doc.payload.doc.data() obtiene la data del snapshop, data() funcion del prototype del snapchot
                    }
                  })
                })
              );
        

  }

  borrarIngresoEgreso(idItem: string){
    return this.firestore.doc(`${this.authServices.getUser.uid}/ingreso-egreso/items/${idItem}`).delete();
  }



}
