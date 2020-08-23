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
import { LoginToolBarComponent } from './toolbar/login/login-tool-bar.component';
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
@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    LogobarComponent,
    CurrentPathComponent,
    SearchComponent,
    ProductComponent,
    FooterComponent,
    LoginToolBarComponent,
    LoginComponent,
    InputComponent,
    CodeInputComponent
  ],
    imports: [
        BrowserAnimationsModule,
        BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        MatDialogModule,
        MatButtonModule,
        MatInputModule,
        MatIconModule,
        FormsModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
