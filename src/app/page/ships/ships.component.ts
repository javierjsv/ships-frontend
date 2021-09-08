import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {ServiceService} from '../../core/services/service.service';
import {Router} from '@angular/router';
import {AuthService} from '../../core/services/auth.service';
import {APIRoutes} from '../../core/config/APIRoutes';
import {GLOBAL_STRS} from '../../core/config/Strings';
import {IProfile} from '../../shared/interfaces/interface.user';

@Component({
  selector: 'app-ships',
  templateUrl: './ships.component.html',
  styleUrls: ['./ships.component.css']
})
export class ShipsComponent implements OnInit {

  public naves: Array<any> = [];
  public GlobalStr = GLOBAL_STRS;
  public profile = <any>[];

  constructor(
    private formBuilder: FormBuilder,
    public API: ServiceService,
    public router: Router,
    public authService: AuthService
  ) {
  }

  ngOnInit(): void {

    for (let i = 0; i < 12; i++) {
      this.naves.push(
        {id: i, nombre: 'nave_' + i, descripcion: 'description_' + i}
      );
    }

    this.getNaves();


  }

  getNaves() {
    this.API.getFormToken(APIRoutes.NAVES).then(resp => {
      console.log('naves', resp);
      this.naves = resp;
    }).catch(err => {
      console.error('Err=>', err);
    });
  }

  setNave(nave: any) {
    console.log(nave);
    const id = nave.id;
    this.router.navigate(['/passenger'], {queryParams: {id}});

  }


}
