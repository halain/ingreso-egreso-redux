import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanLoad, Route, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {

  constructor(private authServices: AuthService, private router: Router) {  }
  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> {
    return this.authServices.isAuth() //true or false
              .pipe(
                tap( estado => {
                  if (!estado) {
                    return this.router.navigate(['login'])
                  }
                }),
                take(1) //para que cada vez que se intente entrar al modulo dispare una nueva susbscripcion, se cancela la subscripcion cuando se resuelve la primera vez
              )
  }
 
  canActivate(): Observable<boolean> {

    return this.authServices.isAuth() //true or false
              .pipe(
                tap( estado => {
                  if (!estado) {
                    return this.router.navigate(['login'])
                  }
                })
              )
  }
  
}
