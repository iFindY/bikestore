import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { LogobarComponent } from './logobar/logobar.component';
import { CurrentPathComponent } from './current-path/current-path.component';
import { SearchComponent } from './search/search.component';
import { ProductComponent } from './product/product.component';
import { FooterComponent } from './footer/footer.component';
import {MegaMenuModule} from 'primeng/megamenu';
import { ButtonModule } from 'primeng/button';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { LoginTooolBarComponent } from './toolbar/login/login-toool-bar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogModule, SharedModule } from 'primeng';
import {InputTextModule} from 'primeng/inputtext';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    LogobarComponent,
    CurrentPathComponent,
    SearchComponent,
    ProductComponent,
    FooterComponent,
    LoginTooolBarComponent,
    LoginComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    MegaMenuModule,
    ButtonModule,
    OverlayPanelModule,
    SharedModule,
    ReactiveFormsModule,
    DialogModule,
    ReactiveFormsModule,
    InputTextModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
