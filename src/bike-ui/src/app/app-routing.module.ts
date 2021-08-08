import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserComponent } from './user/user.component';
import {TeamComponent} from "./team/team.component";
import {LandingComponent} from "./landing/landing.component";

const routes: Routes = [
   // { path: '', component: AppComponent, resolve: {info : UserInfo}}, testing
    { path: '', component: LandingComponent, },
    { path: 'user', component: UserComponent, },
    { path: 'team', component: TeamComponent, },
    ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
