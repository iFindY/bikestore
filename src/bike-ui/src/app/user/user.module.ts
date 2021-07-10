import {StateService} from "./user-state-service";
import {NgModule} from "@angular/core";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatDialogModule} from "@angular/material/dialog";
import {HttpClientModule} from "@angular/common/http";
import {AppRoutingModule} from "../app-routing.module";
import {UserEffects} from "../state/user/user.effects";
import {EffectsModule} from "@ngrx/effects";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {InfoComponent} from "./info/info.component";
import {LoginComponent} from "./login/login.component";
import {ResetComponent} from "./reset/reset.component";
import {CommonAppModule} from "../common/common-app.module";
import {UserComponent} from "./user.component";

@NgModule({
  declarations: [
    UserComponent,
    InfoComponent,
    LoginComponent,
    ResetComponent
  ],
  imports: [
    HttpClientModule,
    CommonAppModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    EffectsModule.forFeature([UserEffects]),
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
  ],
  providers: [StateService],
})
export class UserModule {
}
