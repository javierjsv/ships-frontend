import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from '../../core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private  router: Router,
              private auth: AuthService,
  ) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    // si retorna a true va saguir a la ruta
    if (this.auth.getUseRol() == 'Administrador') {
      return true;
    } else {
      // no va saguir y redirige a la ruta que se ponga por default
      this.router.navigate(['/login']);
      return false;
    }
  }


}
