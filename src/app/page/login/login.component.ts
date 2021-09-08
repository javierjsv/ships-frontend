import {Component, OnInit} from '@angular/core';
import {Validators, FormBuilder, FormGroup, FormControl} from '@angular/forms';
import {ServiceService} from '../../core/services/service.service';
import {APIRoutes} from '../../core/config/APIRoutes';
import {Router} from '@angular/router';
import {GLOBAL_STRS} from '../../core/config/Strings';
import {AuthService} from '../../core/services/auth.service';
import {JwtHelperService} from '@auth0/angular-jwt';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  public form: FormGroup;
  public GlobalStr = GLOBAL_STRS;

  constructor(
    private formBuilder: FormBuilder,
    public API: ServiceService,
    public router: Router,
    public authService: AuthService
  ) {

    this.form = this.formBuilder.group({
      password: ['', Validators.required],
      email: ['', Validators.compose([
        Validators.pattern('^\\w+@[a-zA-Z_]+?\\.[a-zA-Z.]{2,7}$'),
        Validators.required
      ])]
    });
  }

  ngOnInit(): void {

    if (this.authService.isLogged()) {

      if (this.authService.getUseRol() == 'Administrador') {
        this.router.navigateByUrl('/dashboard');
      }
      if (this.authService.getUseRol() == 'Piloto') {
        this.router.navigateByUrl('/pilot');
      }
      if (this.authService.getUseRol() == 'Pasajero') {
        this.router.navigateByUrl('/ships');
      }
    }

    this.form.setValue({

      // email: 'piloto@hotmail.com',
      // email: 'admin@hotmail.com',
      email: 'pasajero@hotmail.com',
      password: '123Nave123',
    });

  }


  field(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({onlySelf: true});
      } else if (control instanceof FormGroup) {
        this.field(control);
      }
    });
  }

  async login() {
    // console.log(this.form.value);

    if (this.form.invalid) {
      this.field(this.form);
      return;
    }

    const data = new FormData();

    data.append('email', this.form.value.email);
    data.append('password', this.form.value.password);

    await this.API.postForm(this.form.value, APIRoutes.SIGNUP_USER).then((resp: any) => {
      // console.log(resp);
      // console.log(resp['accessToken']);
      localStorage.setItem('token', JSON.stringify(resp['accessToken']));

      const helper = new JwtHelperService();
      const decodedToken = helper.decodeToken(resp['accessToken']);

      console.log(localStorage.getItem('token'));


      setTimeout(() => {
        this.getUser(decodedToken.jti)
      }, 2000)


    }).catch(err => {
      console.error('Errr=>', err);
      this.API.alertSwit('Sorry ', 'An error occurred wiht you user', 'error');
    });

  }

  go(url: string) {
    this.router.navigateByUrl(url);
  }


  getUser(id: any) {

    this.API.getFormToken(APIRoutes.MY_PROFILE + '/' + id).then(resp => {
      // console.log('res', resp);

      localStorage.setItem('user', JSON.stringify(resp));
      localStorage.setItem('id', JSON.stringify(resp.id));

      /* console.log(JSON.parse(JSON.stringify(localStorage.getItem('user'))));

       console.log(resp['roles'][0]['nombre']);*/

      localStorage.setItem('rol', JSON.stringify(resp['roles'][0]['nombre']));


      if (resp.roles.length != 0) {
        if (resp['roles'][0]['nombre'] === 'Administrador') {
          this.router.navigateByUrl('/dashboard');
        } else if (resp['roles'][0]['nombre'] === 'Piloto') {
          this.router.navigateByUrl('/pilot');
        } else if (resp['roles'][0]['nombre'] === 'Pasajero') {
          this.router.navigateByUrl('/ships');
        }
      }
      else {
        this.API.alertSwit('Sorry', 'The user does not have a valid role', 'error');
      }


      this.form.reset();
      // this.router.navigateByUrl('/dashboard');

      // this.router.navigateByUrl('/ships');
    }).catch(err => {
      console.error(err);
    });
  }

}
