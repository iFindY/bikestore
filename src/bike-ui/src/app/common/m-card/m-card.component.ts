import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-m-card',
  templateUrl: './m-card.component.html',
  styleUrls: ['./m-card.component.scss']
})
export class MCardComponent implements OnInit {

  mouseover: boolean;
  @Input() content: { title: string, lessons: string[], img: string }

  constructor() { }

  ngOnInit(): void {
  }


  mouseOver(b: boolean) {
    this.mouseover= b;
  }


  get image(){

    return {

      'background-image': `url(${this.content.img})`
    };
  }

}
