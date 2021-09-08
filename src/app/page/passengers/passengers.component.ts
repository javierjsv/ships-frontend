import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {APIRoutes} from '../../core/config/APIRoutes';
import {ServiceService} from '../../core/services/service.service';
import {ActivatedRoute, Router} from '@angular/router';
import {IProfile} from '../../shared/interfaces/interface.user';
import {GLOBAL_STRS} from '../../core/config/Strings';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import {AuthService} from "../../core/services/auth.service";

@Component({
  selector: 'app-passengers',
  templateUrl: './passengers.component.html',
  styleUrls: ['./passengers.component.css']
})
export class PassengersComponent implements OnInit {

  public idParams: any;
  public order = <any>[];
  public pasajes: Array<any> = [];
  public profile = <any>[];
  public idUser: any;
  public GlobalStr = GLOBAL_STRS;
  public form: FormGroup;
  public state = {
    save: true
  };
  public date = moment().format();
  public pasajeSelect = <any>[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private ref: ChangeDetectorRef,
    private API: ServiceService,
    public  router: Router,
    public authService: AuthService
  ) {

    this.activatedRoute.queryParams
      .subscribe(params => {
        // console.log(params);
        if (params.id == undefined) {

          this.router.navigateByUrl('/ships');

        } else {
          this.idParams = params.id;
          this.getShip();
        }
      });

    this.form = this.formBuilder.group({
      id: [''],
      ubicacion: ['', Validators.compose([Validators.required])],
      fecha_llegada: ['', Validators.compose([Validators.required])],
      fecha_salida: ['', Validators.compose([Validators.required])],
      fecha_creacion: [this.date],
      usuario: [''],
      nave: ['']
    });

  }

  ngOnInit(): void {

    this.idUser = this.authService.getIdUser();
    this.profile = this.authService.getUsetStorage();
    // console.log(this.profile);
    this.myPasajes();
    this.getShip();

  }

  getShip() {

    this.API.getFormToken(APIRoutes.NAVES + '/' + this.idParams).then(res => {
      // console.log('result', res);
      this.order = res;
    }).catch(error => {
      console.error('error', error);
    });

  }


  myPasajes() {

    this.API.getFormToken(APIRoutes.MY_PASAJES + this.profile['id']).then(res => {
      console.log('result pasajes', res);
      this.pasajes = res;
    }).catch(error => {
      console.error('error', error);
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
    console.log(this.form.value);

    if (this.form.invalid) {
      this.field(this.form);
      return;
    }
    let data = {};

    if (this.state.save) {


      data = {
        'ubicacion': this.form.value.ubicacion,
        'fecha_llegada': this.form.value.fecha_llegada,
        'fecha_salida': this.form.value.fecha_salida,
        'fecha_creacion': this.date,
        'nave': {
          'id': this.order.id
        },
        'usuario': {
          'id': this.idUser
        }
      };

      this.API.postFormToken(data, APIRoutes.PASAJERO).then(resp => {
        console.log('save', resp);

        this.myPasajes();
        this.form.reset();

      }).catch(err => {
        console.error('Err=>', err);
        this.API.alertSwit('Sorry ', 'An error occurred', 'error');
      });
    } else {

      this.API.putFormToken(JSON.parse(JSON.stringify(this.form.value)), APIRoutes.PASAJERO + `/${this.pasajeSelect['id']}`).then(resp => {
        console.log('update', resp);
        this.form.reset();
        this.pasajeSelect = [];
        this.myPasajes();

      }).catch(err => {
        console.error('Err=>', err);
        this.form.reset();
        this.API.alertSwit('Sorry ', 'An error occurred', 'error');
      });
    }


  }

  setValue(item: any) {
    this.pasajeSelect = item;
    this.form.patchValue(item);

    console.log(this.form.value);

    this.form.patchValue(
      {
        fecha_salida: moment(item.fecha_salida).format('YYYY-MM-DDThh:mm'),
        fecha_llegada: moment(item.fecha_llegada).format('YYYY-MM-DDThh:mm'),
      }
    );

    this.state.save = false;

    setTimeout(() => {
      console.log('here');
      const a: any = document.getElementById('formPsa');
      a.scrollIntoView({
        behavior: 'smooth'
      });
    }, 1000);
  }

  deleteLik(pasaje: any, index: any) {

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

        console.log('pasaje', pasaje, 'index', index);
        this.API.deleteToken(APIRoutes.PASAJERO + `/${pasaje.id}`).then(resp => {
          this.pasajes.splice(index, 1);

          this.API.alertSwit('Deleted', 'Your Ship spacial has been deleted.', 'success');

          console.log(resp);
        }).catch(err => {
          console.error('Error', err);
          this.API.alertSwit('Problem', 'Your Ship has not been deleted.', 'error');
        });
      }
    });
  }


}
