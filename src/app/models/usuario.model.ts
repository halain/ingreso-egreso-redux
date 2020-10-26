

export class Usuario {

    static fromFirebase( {email, uid, nombre} ){ //user obtenido de firebase

        return new Usuario(uid, nombre, email); //para que haga match con el de esta clase
    } 
    
    constructor(
        public uid: string,
        public nombre: string,
        public email: string,
        ) { }
}