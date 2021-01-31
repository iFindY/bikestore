import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { LogobarComponent } from './logobar/logobar.component';
import { CurrentPathComponent } from './current-path/current-path.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {  HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { InputComponent } from './common/input/input.component';
import { CodeInputComponent } from './common/code-input/code-input.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingButtonComponent } from './common/loading-button/loading-button.component';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { RouterState, StoreRouterConnectingModule } from '@ngrx/router-store';
import { environment } from '../environments/environment';
import { metaReducers, reducers } from './state';
import { UserEffects } from './state/user/user.effects';


@NgModule({
    declarations: [
        AppComponent,
        ToolbarComponent,
        LogobarComponent,
        CurrentPathComponent,
        LoginComponent,
        InputComponent,
        CodeInputComponent,
        LoadingButtonComponent,
    ],
    imports: [
        BrowserAnimationsModule,
        BrowserModule,
        // import app routing
        AppRoutingModule,
        // import ngrx stuff
        StoreModule.forRoot(reducers, {
            metaReducers,
            runtimeChecks : {
                strictStateImmutability: true,
                strictActionImmutability: true,
                strictActionSerializability: true,
                strictStateSerializability:true
            }
        }),
        // setup store for router state
        StoreDevtoolsModule.instrument({maxAge: 25, logOnly: environment.production}),
        EffectsModule.forRoot([UserEffects]),
        StoreRouterConnectingModule.forRoot({
            stateKey: 'router',
            routerState: RouterState.Minimal
        }),

        ReactiveFormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        MatDialogModule,
        MatButtonModule,
        MatInputModule,
        MatIconModule,
        FormsModule,
        MatProgressSpinnerModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
