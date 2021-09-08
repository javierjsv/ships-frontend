import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {APIRoutes} from '../../core/config/APIRoutes';
import {AuthService} from '../services/auth.service';
import {Observable} from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  public url_receiver: any;
  public not_domain: any;
  public form_data: any;

  constructor(
    public http: HttpClient,
    public authService: AuthService
  ) {



  }


  getForm(relUrl: string) {
    return new Promise((resolve, reject) => {
      this.url_receiver = relUrl;
      this.http.get(APIRoutes.ROOT + relUrl)
        .subscribe(res => {
          resolve(res);
        }, (error) => {
          reject(error);
        });
    });
  }

  getUrl(relUrl: string) {
    return new Promise((resolve, reject) => {
      this.url_receiver = relUrl;
      this.http.get(relUrl)
        .subscribe(res => {
          resolve(res);
        }, (error) => {
          reject(error);
        });
    });
  }


  postForm(formData: any, relUrl: string) {
    return new Promise((resolve, reject) => {
      this.http.post(APIRoutes.ROOT + relUrl, formData)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          console.error(err);
        });
    });
  }


  postFormToken(formData: any, relUrl: string) {
    return new Promise((resolve, reject) => {
      this.form_data = formData;
      this.url_receiver = relUrl;
      const headers = new HttpHeaders({
        Authorization: 'Bearer ' + this.authService.getToken()
      });

      this.http.post(APIRoutes.ROOT + relUrl, formData, {headers: headers})
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  putFormToken(formData: any, relUrl: string) {
    return new Promise((resolve, reject) => {
      this.form_data = formData;
      this.url_receiver = relUrl;
      const headers = new HttpHeaders({
        Authorization: 'Bearer ' + this.authService.getToken()
      });

      this.http.put(APIRoutes.ROOT + relUrl, formData, {headers: headers})
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  getFormToken(relUrl: string, notDomain = false) {


    return new Promise<any>((resolve, reject) => {
      this.url_receiver = relUrl;
      this.not_domain = notDomain;

      let headers;
      if (this.authService.getToken() != '') {
        headers = new HttpHeaders({
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + this.authService.getToken()
        });

      } else {
        headers = new HttpHeaders({
          Accept: 'application/json',
          'Content-Type': 'application/json'

        });
      }
      this.http.get((notDomain ? '' : APIRoutes.ROOT) + relUrl, {headers: headers})
        .subscribe(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  }


  deleteToken(relUrl: string) {
    return new Promise((resolve, reject) => {
      this.url_receiver = relUrl;
      const headers = new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.authService.getToken()
      });

      this.http.delete(APIRoutes.ROOT + relUrl, {headers: headers})
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }


  alertSwit(title: any, text: any, icon: any) {
    Swal.fire({
      title, text, icon,
      confirmButtonText: 'Accpet'
    });
  }

  alertSucces(title: any, text: any) {
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title,
      showConfirmButton: false,
      timer: 1500
    });
  }

  alertError(title: any, text: any) {
    Swal.fire({
      position: 'top-end',
      icon: 'error',
      title,
      showConfirmButton: false,
      timer: 1500
    });
  }
}
