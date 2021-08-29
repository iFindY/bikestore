import {Component, OnInit, ViewChild} from '@angular/core';
import {MatMenuTrigger} from "@angular/material/menu";

@Component({
  selector: 'app-menu-lessons',
  templateUrl: './menu-lessons.component.html',
  styleUrls: ['./menu-lessons.component.scss']
})
export class MenuLessonsComponent implements OnInit {

  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;


  lessons: { title: string, lessons: string[], img: string } [] = [
    {title: 'Tastenlessonsrumente', lessons : ['Klavier, Keyboard, Akkordion'],img:'https://image.flaticon.com/icons/png/512/820/820654.png'},
    {title: 'Zuplflessonsrumente', lessons : ['Gitarre', 'E-Gitarre', 'E-Bass', 'Ukulele'],img:'https://image.flaticon.com/icons/png/512/820/820644.png'},
    {title: 'Schlaglessonsrumente', lessons : ['Schlagzeug', 'percussion'],img:'https://image.flaticon.com/icons/png/512/820/820669.png'},
    {title: 'Streichlessonsrumente', lessons : ['Geige', 'Bratsche', 'Cello'],img:'https://image.flaticon.com/icons/png/512/820/820651.png'},
    {title: 'Holzblaslessonsrumente', lessons : ['Saxophon', 'Klarinette', 'Blockflöte', 'Oboe', 'Fagott', 'Querflöte', 'Mundhamonika', 'Blues Harp'], img:'https://image.flaticon.com/icons/png/512/820/820660.png'},
    {title: 'Blechblaslessonsrument', lessons : ['Trompete', 'Posaune', 'Horn', 'Tuba'],img:'https://image.flaticon.com/icons/png/512/820/820653.png'},
    {title: 'Kids', lessons : ['Musikalische Früherzhung', 'Musik für Mäuse, Kinderchor'],img:'https://image.flaticon.com/icons/png/512/820/820647.png'},
    {title: 'Stimmbildung', lessons : ['Gesanguntericht', 'Stimmbildung'],img:'https://image.flaticon.com/icons/png/512/820/820684.png'}];





  constructor() { }

  ngOnInit(): void {
  }


  click(lesson: { title: string; lessons: string[]; img: string }) {
    console.log(lesson)
    this.trigger.closeMenu()
  }
}
