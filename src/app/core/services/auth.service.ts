import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  token: any;

  constructor() {
  }

  getToken() {
    if (localStorage.getItem('token')) {
      // console.log('localStore' + localStorage.getItem('token'));
      this.token = localStorage.getItem('token');
      let data: any;
      data = localStorage.getItem('token');
      const conver = JSON.parse(data);
      return conver;
    } else {
      return undefined;
    }
  }

  getIdUser() {
    if (localStorage.getItem('id')) {
      // this.token = localStorage.getItem('id');
      // console.log(this.token);
      let data: any;
      data = localStorage.getItem('id');
      const conver = JSON.parse(data);
      return conver;
    } else {
      return undefined;
    }
  }

  getUsetStorage() {
    if (localStorage.getItem('user')) {
      let data: any;
      data = localStorage.getItem('user');
      const conver = JSON.parse(data);
      return conver;
    } else {
      return undefined;
    }
  }

  getUseRol() {
    if (localStorage.getItem('rol')) {
      let data: any;
      data = localStorage.getItem('rol');
      const conver = JSON.parse(data);
      return conver;
    } else {
      return undefined;
    }
  }

  isLogged() {
    if (localStorage.getItem('token')) {
      return true;
    } else {
      return false;
    }
  }

}
