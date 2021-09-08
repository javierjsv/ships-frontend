import {Component, OnInit} from '@angular/core';
import {GLOBAL_STRS} from '../../core/config/Strings';
import {IProfile} from '../../shared/interfaces/interface.user';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ServiceService} from '../../core/services/service.service';
import {Router} from '@angular/router';
import {AuthService} from '../../core/services/auth.service';
import {APIRoutes} from '../../core/config/APIRoutes';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pilot',
  templateUrl: './pilot.component.html',
  styleUrls: ['./pilot.component.css']
})
export class PilotComponent implements OnInit {
  public GlobalStr = GLOBAL_STRS;
  public profile = <any>[];
  public form: FormGroup;
  public naves: Array<any> = [];
  public idUser: any;
  public naveSelect = <any>[];
  public state = {
    save: true
  };

  constructor(
    private formBuilder: FormBuilder,
    public API: ServiceService,
    public router: Router,
    public authService: AuthService
  ) {

    this.form = this.formBuilder.group({
      descripcion: ['', Validators.compose([Validators.required])],
      nombre: ['', Validators.compose([Validators.required])],
    });
  }

  ngOnInit(): void {

    this.idUser = this.authService.getIdUser();
    this.profile = this.authService.getUsetStorage();
    this.getNaves();

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

    if (this.form.invalid) {
      this.field(this.form);
      return;
    }


    let data = {};


    if (this.state.save) {

      data = {
        'nombre': this.form.value.nombre,
        'descripcion': this.form.value.descripcion,
        'usuario': {
          'id': this.profile['id']
        }
      };

      this.API.postFormToken(data, APIRoutes.NAVES).then(resp => {
        console.log('save', resp);

        this.API.alertSucces('success ', 'Your work has been saved');

        this.getNaves();
        this.form.reset();

      }).catch(err => {
        console.error('Err=>', err);
        this.API.alertError('Sorry', 'An error occurred');
      });
    } else {

      data = {
        'id': this.naveSelect['id'],
        'nombre': this.form.value.nombre,
        'descripcion': this.form.value.descripcion,
        'usuario': {
          'id': this.profile['id']
        }
      };


      this.API.putFormToken(data, APIRoutes.NAVES + `/${this.naveSelect['id']}`).then(resp => {
        console.log('update', resp);
        this.form.reset();
        this.naveSelect = [];
        this.state.save = true;
        this.getNaves();

      }).catch(err => {
        console.error('Err=>', err);
        this.API.alertError('Sorry', 'An error occurred');
      });
    }


  }

  getNaves() {

    //

    this.API.getFormToken(APIRoutes.MY_NAVES + this.idUser).then(resp => {
      console.log('naves', resp);
      this.naves = resp;
    }).catch(err => {
      console.error('Err=>', err);
    });
  }


  deleteLik(nave: any, index: number) {

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

        console.log('nave', nave, 'index', index);
        this.API.deleteToken(APIRoutes.NAVES + `/${nave.id}`).then(resp => {
          this.naves.splice(index, 1);

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
    this.naveSelect = item;
    this.form.patchValue(item);
    this.state.save = false;
    setTimeout(() => {
      console.log('here');
      const a: any = document.getElementById('form');
      a.scrollIntoView({
        behavior: 'smooth'
      });
    }, 1000);
  }


}
