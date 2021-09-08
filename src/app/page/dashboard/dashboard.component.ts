import {Component, OnInit} from '@angular/core';
import {GLOBAL_STRS} from '../../core/config/Strings';
import {IProfile} from '../../shared/interfaces/interface.user';
import {Validators, FormBuilder, FormGroup, FormControl} from '@angular/forms';
import {ServiceService} from '../../core/services/service.service';
import {Router} from '@angular/router';
import {APIRoutes} from '../../core/config/APIRoutes';
import {AuthService} from '../../core/services/auth.service';
import {INave} from '../../shared/interfaces/interface.naves';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {


  public GlobalStr = GLOBAL_STRS;
  public profile = <any>[];
  public form: FormGroup;
  public idUser: any;
  public userSelect = <any>[];
  public users: Array<any> = [];
  public state = {
    save: false
  };

  constructor(
    private formBuilder: FormBuilder,
    public API: ServiceService,
    public router: Router,
    public authService: AuthService
  ) {

    this.form = this.formBuilder.group({
      id: [''],
      nombre: ['', Validators.compose([Validators.required])],
      cedula: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required])],
      password: [''],
      roles: [''],
    });
  }

  ngOnInit(): void {

    this.idUser = this.authService.getIdUser();
    this.profile = this.authService.getUsetStorage();
    this.getusers();
  }


  getusers() {
    this.API.getFormToken(APIRoutes.MY_PROFILE).then((resp: any) => {
      console.log(resp);
      this.users = resp;
    }).catch(err => {
      console.error('Err=>', err);
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

  save() {

    // console.log(this.form.value);
    // console.log(this.form.controls);

    if (this.form.invalid) {
      this.field(this.form);
      this.API.alertError('Sorry', 'Formulary')
      return;
    }

    this.API.putFormToken(JSON.parse(JSON.stringify(this.form.value)), APIRoutes.USER + `/${this.userSelect['id']}`).then(resp => {
      // console.log('update', resp);
      this.form.reset();
      this.userSelect = [];
      this.state.save = false;
      this.API.alertSucces('Succes', 'Updated user');
      this.getusers();

    }).catch(err => {
      console.error('Err=>', err);
      this.API.alertSwit('Sorry ', 'An error occurred', 'error');
    });
  }


  deleteLik(user: any, index: number) {

    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {

        console.log('user', user, 'index', index);
        this.API.deleteToken(APIRoutes.USER + `/${user.id}`).then(resp => {
          this.users.splice(index, 1);

          this.API.alertSwit('Deleted', 'Your Ship spacial has been deleted.', 'success');

          console.log(resp);
        }).catch(err => {
          console.error('Error', err);
          this.API.alertSwit('Problem', 'Your Ship has not been deleted.', 'error');
        });
      }
    });
  }


  setValue(item: any) {
    this.userSelect = item;
    this.form.patchValue(item);
    this.state.save = true;
    /*     setTimeout(() => {
          console.log('here
    /*      const a: any = document.getElementById('formUptade');
          a.scrollIntoView({
            behavior: 'smooth'
          });
        }, 1000);*/
  }


}
