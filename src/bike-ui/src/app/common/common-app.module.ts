import {CodeInputComponent} from "./code-input/code-input.component";
import {InputComponent} from "./input/input.component";
import {LoadingButtonComponent} from "./loading-button/loading-button.component";
import {NgModule} from "@angular/core";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {CommonModule} from "@angular/common";
import {MatAutocompleteModule} from "@angular/material/autocomplete";

@NgModule({
  declarations: [
    CodeInputComponent,
    InputComponent,
    LoadingButtonComponent
  ],
  exports: [
    InputComponent,
    CodeInputComponent,
    LoadingButtonComponent
  ],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    CommonModule,
    FormsModule,
    MatAutocompleteModule
  ]
})
export class CommonAppModule {
}
