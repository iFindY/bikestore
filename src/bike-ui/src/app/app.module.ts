import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingComponent } from './landing/landing.component';
import { LogobarComponent } from './logobar/logobar.component';
import { CurrentPathComponent } from './current-path/current-path.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { RouterState, StoreRouterConnectingModule } from '@ngrx/router-store';
import { environment } from '../environments/environment';
import { metaReducers, reducers } from './state';

import {UserModule} from "./user/user.module";
import {MatButtonModule} from "@angular/material/button";
import {MatMenuModule} from "@angular/material/menu";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatListModule} from "@angular/material/list";
import {MatTreeModule} from "@angular/material/tree";
import {MatExpansionModule} from "@angular/material/expansion";
import { TeamComponent } from './team/team.component';
import {MatCardModule} from "@angular/material/card";
import {CommonAppModule} from "./common/common-app.module";
import {MatRippleModule} from "@angular/material/core";
import {MatChipsModule} from "@angular/material/chips";
import {FormsModule} from "@angular/forms";



@NgModule({
    declarations: [
        AppComponent,
        LandingComponent,
        LogobarComponent,
        CurrentPathComponent,
        TeamComponent,
    ],
  imports: [
    UserModule,
    BrowserAnimationsModule,
    BrowserModule,
    // import app routing
    AppRoutingModule,
    // import ngrx stuff
    EffectsModule.forRoot(),
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
        strictActionSerializability: true,
        strictStateSerializability: true
      }
    }),
    // setup store for router state
    StoreDevtoolsModule.instrument({maxAge: 25, logOnly: environment.production}),
    StoreRouterConnectingModule.forRoot({
      stateKey: 'router',
      routerState: RouterState.Minimal
    }),
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatTreeModule,
    MatExpansionModule,
    MatCardModule,
    CommonAppModule,
    MatRippleModule,
    MatChipsModule,
    FormsModule
  ],
    providers: [],
    exports: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
