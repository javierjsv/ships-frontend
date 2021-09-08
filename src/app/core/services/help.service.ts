import {Injectable} from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class HelpService {

  constructor() {
  }

  alertSwit(title: any, text: any, icon: any) {
    Swal.fire({
      title, text, icon,
      confirmButtonText: 'Accpet'
    });
  }
}
