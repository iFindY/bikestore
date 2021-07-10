import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
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



@NgModule({
    declarations: [
        AppComponent,
        ToolbarComponent,
        LogobarComponent,
        CurrentPathComponent,
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
        })
    ],
    providers: [],
    exports: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
