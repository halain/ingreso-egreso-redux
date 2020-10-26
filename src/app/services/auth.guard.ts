import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authServices: AuthService, private router: Router) {  }
 
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
