import {Component, OnInit} from '@angular/core';
import {Validators, FormBuilder, FormGroup, FormControl} from '@angular/forms';
import {APIRoutes} from '../../core/config/APIRoutes';
import {ServiceService} from '../../core/services/service.service';
import {Router} from '@angular/router';
import {GLOBAL_STRS} from '../../core/config/Strings';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {


  public form: FormGroup;
  public roles: Array<any> = [];
  public GlobalStr = GLOBAL_STRS;

  constructor(
    private formBuilder: FormBuilder,
    public API: ServiceService,
    public router: Router
  ) {

    this.form = this.formBuilder.group({
      name: ['', Validators.compose([
        Validators.pattern('^\\w+[a-zA-Z_]'),
        Validators.required
      ])],
      email: ['', Validators.compose([
        Validators.pattern('^\\w+@[a-zA-Z_]+?\\.[a-zA-Z.]{2,7}$'),
        Validators.required
      ])],
      password: ['', Validators.compose([Validators.required])],
      cedula: ['', Validators.compose([Validators.required])],
      rol: ['', Validators.compose([Validators.required])],

    });
  }

  ngOnInit(): void {
    this.getRoles();

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

  singUp() {

    console.log(this.form.value);

    if (this.form.invalid) {
      this.field(this.form);
      return;
    }

    const data: any = {
      nombre: this.form.value.name,
      email: this.form.value.email,
      cedula: this.form.value.cedula.toString(),
      password: this.form.value.password,
      rol: [this.form.value.rol]
    };


    this.API.postForm(data, APIRoutes.REGISTER).then(resp => {
      console.log(resp);
      this.API.alertSucces('Save', 'User');
      this.form.reset();
      this.router.navigateByUrl('login');


    }).catch(err => {
      console.log('Error', err);
      this.API.alertSwit('Sorry ', err, 'error');

    });


  }

  go(url: string) {
    this.router.navigateByUrl(url);
  }


  getRoles() {

    this.API.getForm(APIRoutes.LIST_ROLES).then((resp: any) => {
      console.log(resp);
      this.roles = resp;
    }).catch(err => {
      console.error('Err', err);
    });

  }


  login() {
    console.log(this.form.value);
    console.log(this.form.controls);

    if (this.form.invalid) {
      this.field(this.form);
      return;
    }

    const data = new FormData();

    data.append('email', this.form.value.email);
    data.append('password', this.form.value.password);

    this.API.postForm(this.form.value, APIRoutes.SIGNUP_USER).then((resp: any) => {
      console.log(resp);
      console.log(resp['accessToken']);
      localStorage.setItem('token', JSON.stringify(resp['accessToken']));
      this.form.reset();
      this.router.navigateByUrl('/dashboard');
    }).catch(err => {
      console.error('Errr=>', err);
      this.API.alertSwit('Sorry ', 'An error occurred wiht you user', 'error');
    });

  }


}
