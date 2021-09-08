import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'nave';

  constructor(private translateService: TranslateService) {
    this.initApp();

  }

  initApp() {
    const lang: any = localStorage.getItem('lang') ? localStorage.getItem('lang') : 'es';
    this.translateService.setDefaultLang(lang);
    this.translateService.use(lang);
  }
}
