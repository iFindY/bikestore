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
import { LoginComponent } from './toolbar/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from 'primeng';
@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    LogobarComponent,
    CurrentPathComponent,
    SearchComponent,
    ProductComponent,
    FooterComponent,
    LoginComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    MegaMenuModule,
    ButtonModule,
    OverlayPanelModule,
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
