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
import { CardComponent } from './card/card.component';
import {MatCardModule} from "@angular/material/card";
import {MatDividerModule} from "@angular/material/divider";
import {MatChipsModule} from "@angular/material/chips";
import { RouterModule } from '@angular/router';
import { MCardComponent } from './m-card/m-card.component';
import {PipeModule} from "./pipe/pipe.module";
import { MenuLessonsComponent } from './menu-lessons/menu-lessons.component';
import {MatMenuModule} from "@angular/material/menu";
import {MatGridListModule} from "@angular/material/grid-list";
import {ClipboardModule} from "@angular/cdk/clipboard";

@NgModule({
  declarations: [
    CodeInputComponent,
    InputComponent,
    LoadingButtonComponent,
    CardComponent,
    MCardComponent,
    MenuLessonsComponent
  ],
  exports: [
    InputComponent,
    CodeInputComponent,
    LoadingButtonComponent,
    CardComponent,
    MCardComponent,
    MenuLessonsComponent
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
    MatAutocompleteModule,
    MatCardModule,
    MatDividerModule,
    MatChipsModule,
    RouterModule,
    PipeModule,
    MatMenuModule,
    MatGridListModule,
    ClipboardModule
  ]
})
export class CommonAppModule {
}
