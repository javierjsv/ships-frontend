import {Component, OnInit, Input} from '@angular/core';
import {Router} from '@angular/router';
import {GLOBAL_STRS} from '../../core/config/Strings';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {


  @Input() name: string = 'SINGNUP';
  @Input() rute: string = 'login';
  @Input() auth: string = 'false';
  public GlobalStr = GLOBAL_STRS;

  constructor(
    public router: Router,
  ) {
  }

  ngOnInit(): void {
  }

  go() {
    this.router.navigate([this.rute]);
  }


  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    localStorage.removeItem('user');
    this.router.navigateByUrl('login');
  }


}
