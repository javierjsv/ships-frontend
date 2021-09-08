import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RegisterComponent} from './page/register/register.component';
import {LoginComponent} from './page/login/login.component';
import {DashboardComponent} from './page/dashboard/dashboard.component';
import {ShipsComponent} from './page/ships/ships.component';
import {PilotComponent} from './page/pilot/pilot.component';
import {PassengersComponent} from './page/passengers/passengers.component';
import {AuthGuard} from './shared/auth-guard/auth-guard';
import {AdminGuard} from './shared/auth-guard/admin-guard';
import {PilotGuard} from './shared/auth-guard/pilot-guard';
import {PassangerGuard} from './shared/auth-guard/passanger-guard';

const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard, AdminGuard]},
  {path: 'pilot', component: PilotComponent, canActivate: [AuthGuard, PilotGuard]},
  {path: 'passenger', component: PassengersComponent, canActivate: [AuthGuard, PassangerGuard]},
  {path: 'ships', component: ShipsComponent, canActivate: [AuthGuard, PassangerGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
