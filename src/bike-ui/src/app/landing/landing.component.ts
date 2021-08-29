import {Component, OnDestroy} from '@angular/core';

import { Subscription} from "rxjs";
import {LayoutService} from "../services/layout.service";
import {Sizes} from "../services/models/layout.model";

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnDestroy {

  title_1:string ="Die Musik ist die Sprache der Leidenschaft"
  text_1: string = "Wir unterscheiden nicht zwischen E und U. Ob Klassik oder Pop -" +
      "wir helfen Ihnen, Ihren individuellen Wünschen entsprechend, den Weg zu Ihrem " +
      "persönlichen Erfolgserlebnis zu finden. Da das Miteinander beim Musizieren " +
      "in der Regel mehr Freude macht, versuchen wir die Schüler untereinander " +
      "bekannt zu machen und sie zum gemeinsamen musizieren zu motivieren";



  text_2: string = "Jeder hat die Möglichkeit, ganz individuell noch mehr über sein natureigenes " +
      "Instrument Die Stimme zu erfahren und sich mit ihr zu beschäftigen. " +
      "Es ist eine ziemlich aufregende Entdeckungsreise, die man " +
      "gemeinsam mit dem Stimmbildner antritt. Sei es für das Singen im Chor, " +
      "als Mitglied in einer Band oder als Redner auf der Bühne -jeder soll und darf sich dabei " +
      "seiner Stilrichtung widmen";


  windowSize: Sizes = 'XLarge'
  subscriptions: Subscription;
  mouseover2: boolean;
  mouseover: boolean;

  constructor(public screenSizeService: LayoutService) {
    this.subscriptions = this.screenSizeService.getWindowSize()
    .subscribe(size => this.windowSize = size);

  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

}
