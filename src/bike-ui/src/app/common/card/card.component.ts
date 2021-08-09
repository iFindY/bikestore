import { Component, OnInit } from '@angular/core';
import {bodyExpansion} from "./card.animations";

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  animations: [bodyExpansion]
})
export class CardComponent implements OnInit {

  state = 'collapsed';
  constructor() { }

  ngOnInit(): void {
  }

  toggle(): void {
    this.state = this.state === 'collapsed' ? 'expanded' : 'collapsed';
  }
}
